// app/src/repositories/interfaces/billboard.repository.interface.ts

/**
 * Fila plana de una función activa para cartelera.
 */
export interface ActiveFunctionRow {
    functionId: number;
    movieId: number;
    startsAt: Date;
    basePrice: number;
    movieTitle: string;
    posterUrl: string;
    classification: string;
    durationMin: number;
    director: string;
    rating: number;
    cinemaId: number;
    cinemaName: string;
    roomId: number;
    roomName: string;
    roomCapacity: number;
    roomTypeName: string;
    functionTypeName: string;
    projection: string;
    language: string;
    cityId: number;
    countryId: number;
}

/**
 * Información de ocupación por función.
 */
export interface OccupancyInfo {
    capacity: number;
    sold: number;
    locked: number;
    available: number;
    isSoldOut: boolean;
}

/**
 * Contrato del repositorio de cartelera.
 */
export interface IBillboardRepository {
    cityExists(cityId: number): Promise<boolean>;
    getActiveFunctionsByCity(
        cityId: number,
        dateFrom: Date,
        dateTo: Date,
    ): Promise<ActiveFunctionRow[]>;
    getGenresByMovieIds(movieIds: number[]): Promise<Map<number, string[]>>;
    getOccupancyByFunctionIds(
        functionIds: number[],
    ): Promise<Map<number, OccupancyInfo>>;
    getReleasesByMovieIds(
        movieIds: number[],
        countryId: number,
    ): Promise<Map<number, Date>>;
}
