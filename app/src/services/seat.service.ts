import {
    LockSeatsDto,
    LockSeatsResult,
    ReleaseSeatsDto,
    ReleaseSeatsResult,
    ReservationSummary,
    ReservationSummaryLine,
    SeatCategory,
    SeatMap,
    SeatMapItem,
    SeatStatus,
} from "../dto/seat.dto";
import repository from "../repositories/seat.repository";
import { ISeatService } from "./interfaces/seat.service.interface";

/** RN-039: duración del bloqueo temporal de una silla. */
const LOCK_DURATION_MINUTES = 10;

/**
 * Número máximo de sillas que un usuario puede seleccionar por función.
 * La HU-010 lo describe como "configurable por administración"; mientras no
 * exista esa configuración se expone como constante.
 */
const MAX_SEATS_PER_RESERVATION = 10;

/**
 * Normaliza el `seatType` libre almacenado en la tabla `seats` a una de las
 * categorías conocidas por el frontend.
 */
const toCategory = (seatType: string | null | undefined): SeatCategory => {
    const value = (seatType ?? "").trim().toUpperCase();

    if (["VIP"].includes(value)) {
        return "VIP";
    }
    if (["PREFERENTIAL", "PREFERENCIAL", "MOVILIDAD REDUCIDA"].includes(value)) {
        return "PREFERENTIAL";
    }
    if (["DISABLED", "INHABILITADA", "INHABILITADO", "BLOQUEADA"].includes(value)) {
        return "DISABLED";
    }
    return "STANDARD";
};

/**
 * Servicio de Sillas (HU-010) — Selección Interactiva de Sillas
 * -----------------------------------------------------------
 * Contiene la lógica del mapa de sala y del ciclo de vida de los bloqueos
 * temporales que reservan una silla mientras el usuario completa la compra.
 */
class SeatService implements ISeatService {
    async getSeatMap(functionId: number, cartId?: number): Promise<SeatMap> {
        const cineFunction = await repository.findFunctionForSelection(functionId);

        if (!cineFunction) {
            throw new Error("Función no encontrada.");
        }
        if (!cineFunction.room) {
            throw new Error("La función no tiene una sala asociada.");
        }

        const seats = await repository.findSeatsByRoom(cineFunction.room.id);
        const soldSeatIds = new Set<number>(await repository.findSoldSeatIds(functionId));
        const activeLocks = await repository.findActiveLocks(functionId);
        const lockBySeatId = new Map<number, any>(
            activeLocks.map((lock): [number, any] => [lock.seatId, lock]),
        );

        const items: SeatMapItem[] = seats.map((seat: any) => {
            const category = toCategory(seat.seatType);
            let status: SeatStatus;
            let lockedUntil: Date | null = null;

            if (category === "DISABLED") {
                status = "DISABLED";
            } else if (soldSeatIds.has(seat.id)) {
                status = "SOLD";
            } else {
                const lock = lockBySeatId.get(seat.id);
                if (lock) {
                    lockedUntil = lock.expiresAt;
                    status =
                        cartId !== undefined && lock.cartId === cartId
                            ? "SELECTED"
                            : "LOCKED";
                } else {
                    status = "AVAILABLE";
                }
            }

            return {
                id: seat.id,
                row: seat.row,
                number: seat.number,
                category,
                status,
                lockedUntil,
            };
        });

        return {
            functionId,
            room: {
                id: cineFunction.room.id,
                name: cineFunction.room.name,
                capacity: cineFunction.room.capacity,
            },
            maxSeatsPerReservation: MAX_SEATS_PER_RESERVATION,
            availableCount: items.filter((item) => item.status === "AVAILABLE").length,
            seats: items,
        };
    }

    async lockSeats(data: LockSeatsDto): Promise<LockSeatsResult> {
        const { functionId, cartId } = data;
        const seatIds = [...new Set(data.seatIds)];

        if (seatIds.length === 0) {
            throw new Error("Debe seleccionar al menos una silla.");
        }
        if (seatIds.length > MAX_SEATS_PER_RESERVATION) {
            throw new Error(
                `Solo puede seleccionar hasta ${MAX_SEATS_PER_RESERVATION} sillas por función.`,
            );
        }

        const cineFunction = await repository.findFunctionForSelection(functionId);
        if (!cineFunction) {
            throw new Error("Función no encontrada.");
        }
        if (!cineFunction.room) {
            throw new Error("La función no tiene una sala asociada.");
        }

        // Las sillas deben existir y pertenecer a la sala de la función.
        const roomSeats = await repository.findSeatsByRoom(cineFunction.room.id);
        const roomSeatById = new Map<number, any>(
            roomSeats.map((seat: any): [number, any] => [seat.id, seat]),
        );

        const notInRoom = seatIds.filter((id) => !roomSeatById.has(id));
        if (notInRoom.length > 0) {
            throw new Error(
                `Las sillas [${notInRoom.join(", ")}] no pertenecen a la sala de la función.`,
            );
        }

        // RN-041 / RN-042: no se pueden seleccionar sillas inhabilitadas.
        const disabled = seatIds.filter(
            (id) => toCategory(roomSeatById.get(id).seatType) === "DISABLED",
        );
        if (disabled.length > 0) {
            throw new Error(
                `Las sillas [${disabled.join(", ")}] no están habilitadas para la venta.`,
            );
        }

        // RN-040: liberar primero los bloqueos expirados de esas sillas.
        await repository.deleteExpiredLocks(functionId, seatIds);

        // RN-041: descartar sillas vendidas o bloqueadas por otro carrito.
        const soldSeatIds = new Set<number>(await repository.findSoldSeatIds(functionId));
        const activeLocks = await repository.findActiveLocks(functionId, seatIds);
        const lockBySeatId = new Map<number, any>(
            activeLocks.map((lock): [number, any] => [lock.seatId, lock]),
        );

        const rejectedSeatIds: number[] = [];
        const seatsOwnedByCart: number[] = [];
        const seatsToCreate: number[] = [];

        for (const seatId of seatIds) {
            if (soldSeatIds.has(seatId)) {
                rejectedSeatIds.push(seatId);
                continue;
            }
            const lock = lockBySeatId.get(seatId);
            if (lock && lock.cartId !== cartId) {
                rejectedSeatIds.push(seatId);
                continue;
            }
            if (lock) {
                seatsOwnedByCart.push(seatId);
            } else {
                seatsToCreate.push(seatId);
            }
        }

        const expiresAt = new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000);

        // Refrescar el temporizador de las sillas que este carrito ya tenía.
        await repository.refreshLocks(functionId, cartId, seatsOwnedByCart, expiresAt);

        // Crear los bloqueos nuevos. El índice único `(function_id, seat_id)` +
        // ON CONFLICT DO NOTHING evita la doble venta en compras simultáneas (RN-043).
        await repository.createLocksIgnoreDuplicates(
            seatsToCreate.map((seatId) => ({
                cartId,
                functionId,
                seatId,
                expiresAt,
            })),
        );

        // Confirmar qué sillas quedaron efectivamente a nombre de este carrito.
        const confirmedLocks = await repository.findCartLocks(functionId, cartId, seatIds);
        const lockedSeatIds = confirmedLocks.map((lock) => lock.seatId);

        // Las sillas nuevas que no aparecen como propias perdieron la carrera.
        for (const seatId of seatsToCreate) {
            if (!lockedSeatIds.includes(seatId) && !rejectedSeatIds.includes(seatId)) {
                rejectedSeatIds.push(seatId);
            }
        }

        return {
            functionId,
            cartId,
            lockedSeatIds: [...lockedSeatIds].sort((a, b) => a - b),
            rejectedSeatIds: [...rejectedSeatIds].sort((a, b) => a - b),
            expiresAt,
        };
    }

    async releaseSeats(data: ReleaseSeatsDto): Promise<ReleaseSeatsResult> {
        const { functionId, cartId } = data;
        const seatIds =
            data.seatIds && data.seatIds.length > 0
                ? [...new Set(data.seatIds)]
                : undefined;

        const releasedCount = await repository.deleteCartLocks(functionId, cartId, seatIds);

        return { functionId, cartId, releasedCount };
    }

    async getReservationSummary(
        functionId: number,
        cartId: number,
    ): Promise<ReservationSummary> {
        const cineFunction = await repository.findFunctionForSelection(functionId);
        if (!cineFunction) {
            throw new Error("Función no encontrada.");
        }

        const basePrice = Number(cineFunction.basePrice);
        const roomExtraPrice = Number(cineFunction.room?.extraPrice ?? 0);
        const unitPrice = basePrice + roomExtraPrice;

        const locks = await repository.findCartLocks(functionId, cartId);

        if (locks.length === 0) {
            return {
                functionId,
                cartId,
                seatCount: 0,
                basePrice,
                roomExtraPrice,
                unitPrice,
                total: 0,
                expiresAt: null,
                lines: [],
            };
        }

        const seatIds = locks.map((lock) => lock.seatId);
        const seats = await repository.findSeatsByIds(seatIds);
        const seatById = new Map<number, any>(
            seats.map((seat: any): [number, any] => [seat.id, seat]),
        );

        const lines: ReservationSummaryLine[] = locks
            .map((lock) => {
                const seat = seatById.get(lock.seatId);
                return {
                    seatId: lock.seatId,
                    row: seat?.row ?? "",
                    number: seat?.number ?? "",
                    category: seat ? toCategory(seat.seatType) : "STANDARD",
                    unitPrice,
                };
            })
            .sort((a, b) => a.seatId - b.seatId);

        const expiresAt = locks.reduce(
            (earliest, lock) => (lock.expiresAt < earliest ? lock.expiresAt : earliest),
            locks[0].expiresAt,
        );

        return {
            functionId,
            cartId,
            seatCount: locks.length,
            basePrice,
            roomExtraPrice,
            unitPrice,
            total: unitPrice * locks.length,
            expiresAt,
            lines,
        };
    }
}

export default new SeatService();
