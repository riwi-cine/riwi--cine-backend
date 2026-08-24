/**
 * DTO - Creación de Function
 * --------------------------
 * Este DTO representa la infromación necesaria para crear una nueva función
 */

export interface CreateFuntion {
    movie: string;

    room: string;

    functionType: string;

    startAt: Date;

    basePrice: number;

    active: boolean;
}