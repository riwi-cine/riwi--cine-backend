import Seat from "../../models/seat.model";
import SeatLock from "../../models/seat-lock.model";

/**
 * Contrato del Repository de Sillas (HU-010)
 * -----------------------------------------
 * Encapsula todo el acceso a persistencia necesario para construir el mapa
 * de la sala y para administrar los bloqueos temporales de sillas.
 */
export interface ISeatRepository {
    /**
     * Localiza una función seleccionable (activa y aún no iniciada) junto con su sala.
     * @param {number} functionId
     */
    findFunctionForSelection(functionId: number): Promise<any | null>;

    /**
     * Devuelve todas las sillas físicas de una sala.
     * @param {number} roomId
     */
    findSeatsByRoom(roomId: number): Promise<Seat[]>;

    /**
     * Devuelve las sillas indicadas (sin importar la sala).
     * @param {number[]} seatIds
     */
    findSeatsByIds(seatIds: number[]): Promise<Seat[]>;

    /**
     * IDs de sillas ya vendidas para una función (tickets en estado ocupante).
     * @param {number} functionId
     */
    findSoldSeatIds(functionId: number): Promise<number[]>;

    /**
     * Bloqueos vigentes de una función (opcionalmente acotados a un conjunto de sillas).
     * @param {number} functionId
     * @param {number[]} [seatIds]
     */
    findActiveLocks(functionId: number, seatIds?: number[]): Promise<SeatLock[]>;

    /**
     * Bloqueos vigentes que pertenecen a un carrito concreto.
     * @param {number} functionId
     * @param {number} cartId
     * @param {number[]} [seatIds]
     */
    findCartLocks(
        functionId: number,
        cartId: number,
        seatIds?: number[],
    ): Promise<SeatLock[]>;

    /**
     * Elimina los bloqueos expirados de las sillas indicadas (RN-040).
     * @returns número de filas eliminadas.
     */
    deleteExpiredLocks(functionId: number, seatIds: number[]): Promise<number>;

    /**
     * Refresca el temporizador de los bloqueos que ya posee un carrito.
     */
    refreshLocks(
        functionId: number,
        cartId: number,
        seatIds: number[],
        expiresAt: Date,
    ): Promise<void>;

    /**
     * Crea bloqueos nuevos ignorando los que ya existan (ON CONFLICT DO NOTHING).
     * El índice único `(function_id, seat_id)` evita la doble venta (RN-043).
     */
    createLocksIgnoreDuplicates(
        rows: { cartId: number; functionId: number; seatId: number; expiresAt: Date }[],
    ): Promise<void>;

    /**
     * Elimina los bloqueos de un carrito para una función (todos o los indicados).
     * @returns número de filas eliminadas.
     */
    deleteCartLocks(
        functionId: number,
        cartId: number,
        seatIds?: number[],
    ): Promise<number>;
}
