import {
    LockSeatsDto,
    LockSeatsResult,
    ReleaseSeatsDto,
    ReleaseSeatsResult,
    ReservationSummary,
    SeatMap,
} from "../../dto/seat.dto";

/**
 * Contrato del Servicio de Sillas (HU-010)
 * ---------------------------------------
 * Reglas de negocio de la selección interactiva de sillas:
 *  - RN-039: los bloqueos duran 10 minutos.
 *  - RN-040: al liberar/expirar, la silla vuelve a estar disponible.
 *  - RN-041: no se pueden tomar sillas vendidas, bloqueadas o inhabilitadas.
 *  - RN-043: la disponibilidad se evalúa en tiempo real para evitar sobreventa.
 */
export interface ISeatService {
    /**
     * Devuelve el mapa de la sala de una función con el estado de cada silla.
     * @param {number} functionId
     * @param {number} [cartId] Si se indica, las sillas de ese carrito se marcan como SELECTED.
     */
    getSeatMap(functionId: number, cartId?: number): Promise<SeatMap>;

    /**
     * Bloquea temporalmente las sillas seleccionadas por un carrito.
     * @param {LockSeatsDto} data
     */
    lockSeats(data: LockSeatsDto): Promise<LockSeatsResult>;

    /**
     * Libera las sillas bloqueadas por un carrito (todas o las indicadas).
     * @param {ReleaseSeatsDto} data
     */
    releaseSeats(data: ReleaseSeatsDto): Promise<ReleaseSeatsResult>;

    /**
     * Calcula el resumen económico de las sillas bloqueadas por un carrito.
     * @param {number} functionId
     * @param {number} cartId
     */
    getReservationSummary(functionId: number, cartId: number): Promise<ReservationSummary>;
}
