// app/src/repositories/interfaces/movie.repository.interface.ts

import Movie from "../../models/movie.model";

export interface MovieFunctionDetail {
    id: number;
    startsAt: Date;
    basePrice: number;
    active: boolean;
    functionType: {
        id: number;
        name: string;
        projection: string;
        language: string;
    } | null;
    room: {
        id: number;
        name: string;
        capacity: number;
        extraPrice: number;
        roomType: {
            id: number;
            name: string;
            description: string;
        } | null;
        cinema: {
            id: number;
            name: string;
            address: string;
            city: {
                id: number;
                name: string;
            } | null;
        } | null;
    } | null;
    movieRelease?: {
        id: number;
        releaseDate: Date;
        countryId: number;
    };
    ticketsCount: number;
    seatLocksCount: number;
}

/**
 * Contrato del Repositorio de Películas
 * -------------------------------------
 * Define las operaciones de persistencia y consulta
 * disponibles para la entidad Movie.
 *
 * Cualquier implementación deberá cumplir esta interfaz.
 */
export interface IMovieRepository {

    /**
     * Obtiene el detalle completo de una película.
     *
     * Incluye la información relacionada necesaria para
     * mostrar el detalle de la película.
     */
    findDetailById(id: number): Promise<Movie | null>;

    /**
     * Obtiene las funciones futuras de una película.
     *
     * Permite filtrar las funciones según la ciudad seleccionada.
     */
    findFutureFunctions(
        movieId: number,
        cityId?: number
    ): Promise<MovieFunctionDetail[]>;

    /**
     * Obtiene recomendaciones de películas similares.
     *
     * Las recomendaciones se determinarán a partir de
     * características compartidas con la película consultada.
     */
    findRecommendations(movieId: number): Promise<Movie[]>;
/**
 * Contrato del repositorio de catálogo de películas.
 */
    findAll(): Promise<Movie[]>;
    findById(id: number): Promise<Movie>;
    findByTitle(title: string): Promise<Movie[]>;
}