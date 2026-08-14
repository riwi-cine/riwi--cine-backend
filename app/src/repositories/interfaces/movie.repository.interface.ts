// app/src/repositories/interfaces/movie.repository.interface.ts

import Movie from "../../models/movie.model";

/**
 * Contrato del repositorio de catálogo de películas.
 */
export interface IMovieRepository {
    findAll(): Promise<Movie[]>;
    findById(id: number): Promise<Movie>;
    findByTitle(title: string): Promise<Movie[]>;
}
