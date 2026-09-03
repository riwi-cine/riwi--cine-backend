/**
 * DTOs de la HU-010 — Selección Interactiva de Sillas
 * --------------------------------------------------
 * Definen el contrato de datos entre el cliente y la API para:
 *  - Consultar el mapa de la sala de una función (estado de cada silla).
 *  - Bloquear temporalmente las sillas seleccionadas.
 *  - Liberar sillas bloqueadas.
 *  - Obtener el resumen económico antes de continuar al carrito.
 */

/** Estado visual de una silla dentro del mapa de la sala. */
export type SeatStatus =
    | "AVAILABLE" // Disponible
    | "SELECTED" // Seleccionada por el carrito que realiza la consulta
    | "LOCKED" // Reservada temporalmente por otro usuario
    | "SOLD" // Vendida
    | "DISABLED"; // Inhabilitada

/** Categoría de la silla, usada para la representación visual y el precio. */
export type SeatCategory =
    | "STANDARD"
    | "VIP"
    | "PREFERENTIAL" // Movilidad reducida
    | "DISABLED";

/** Una silla del mapa de la sala con su estado calculado en tiempo real. */
export interface SeatMapItem {
    id: number;
    row: string;
    number: string;
    category: SeatCategory;
    status: SeatStatus;
    /** Expiración del bloqueo temporal cuando la silla está LOCKED o SELECTED. */
    lockedUntil: Date | null;
}

/** Mapa completo de la sala asociado a una función. */
export interface SeatMap {
    functionId: number;
    room: {
        id: number;
        name: string;
        capacity: number;
    };
    /** Número máximo de sillas que un usuario puede seleccionar en esta función. */
    maxSeatsPerReservation: number;
    availableCount: number;
    seats: SeatMapItem[];
}

/** Cuerpo para bloquear temporalmente un conjunto de sillas. */
export interface LockSeatsDto {
    functionId: number;
    cartId: number;
    seatIds: number[];
}

/** Cuerpo para liberar sillas bloqueadas por un carrito. */
export interface ReleaseSeatsDto {
    functionId: number;
    cartId: number;
    /** Si se omite, se liberan todas las sillas del carrito para esa función. */
    seatIds?: number[];
}

/** Resultado del bloqueo temporal de sillas. */
export interface LockSeatsResult {
    functionId: number;
    cartId: number;
    lockedSeatIds: number[];
    /** Sillas que no se pudieron bloquear por estar vendidas o tomadas por otro usuario. */
    rejectedSeatIds: number[];
    /** Instante en el que expirará el bloqueo (RN-039: 10 minutos). */
    expiresAt: Date;
}

/** Resultado de liberar sillas de un carrito. */
export interface ReleaseSeatsResult {
    functionId: number;
    cartId: number;
    releasedCount: number;
}

/** Línea del resumen de reserva: una silla seleccionada y su precio unitario. */
export interface ReservationSummaryLine {
    seatId: number;
    row: string;
    number: string;
    category: SeatCategory;
    unitPrice: number;
}

/** Resumen económico de las sillas seleccionadas antes de continuar al carrito. */
export interface ReservationSummary {
    functionId: number;
    cartId: number;
    seatCount: number;
    basePrice: number;
    roomExtraPrice: number;
    unitPrice: number;
    total: number;
    /** Expiración más próxima entre las sillas bloqueadas (null si no hay sillas). */
    expiresAt: Date | null;
    lines: ReservationSummaryLine[];
}
