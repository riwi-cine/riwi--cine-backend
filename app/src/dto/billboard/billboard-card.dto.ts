// app/src/dto/billboard/billboard-card.dto.ts

/**
 * Función disponible dentro de un día de cartelera.
 */
export interface BillboardFunctionScheduleDto {
    functionId: number;
    startsAt: string;
    time: string;
    cinemaId: number;
    cinemaName: string;
    roomId: number;
    roomName: string;
    roomType: string;
    format: string;
    language: string;
    dubbedOrSubtitled: string;
    basePrice: number;
    availableSeats: number;
    isSoldOut: boolean;
}

/**
 * Día de cartelera. RN-012 exige devolver siempre 7 días fijos.
 */
export interface BillboardScheduleDto {
    date: string;
    functions: BillboardFunctionScheduleDto[];
}

/**
 * Tarjeta de película para la cartelera semanal del frontend.
 */
export interface BillboardCardDto {
    movieId: number;
    title: string;
    posterUrl: string;
    genres: string[];
    classification: string;
    durationMin: number;
    director: string;
    language: string;
    dubbedOrSubtitled: string;
    formats: string[];
    schedules: BillboardScheduleDto[];
    rating: number;
    isNewRelease: boolean;
    isSoldOut: boolean;
}
