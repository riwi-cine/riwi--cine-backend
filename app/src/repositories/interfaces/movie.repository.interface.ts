// app/src/repositories/interfaces/movie.repository.interface.ts

import Movie from "../../models/movie.model";
import { FunctionDetail } from "../../models/function.model";


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
    ): Promise<FunctionDetail[]>;

    /**
     * Obtiene recomendaciones de películas similares.
     *
     * Las recomendaciones se determinarán a partir de
     * características compartidas con la película consultada.
     */
    findRecommendations(movieId: number): Promise<Movie[]>;
    findUpcoming(countryId: number): Promise<any[]>;
    findUpcomingDetail(movieId: number, countryId: number): Promise<any | null>;
/**
 * Contrato del repositorio de catálogo de películas.
 */
    findAll(): Promise<Movie[]>;
    findById(id: number): Promise<Movie | null>;
    findByTitle(title: string): Promise<Movie[]>;
}