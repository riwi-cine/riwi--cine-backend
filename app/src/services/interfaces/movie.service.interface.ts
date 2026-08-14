// app/src/services/interfaces/movie.service.interface.ts

import Movie from "../../models/movie.model";

/**
 * Contrato del servicio de catálogo de películas.
 */
export interface IMovieService {
    getAll(): Promise<Movie[]>;
}
