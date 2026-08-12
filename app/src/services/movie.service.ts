// app/src/services/movie.service.ts

import Movie from "../models/movie.model";
import movieRepository from "../repositories/movie.repository";
import { IMovieService } from "./interfaces/movie.service.interface";

/**
 * Servicio de catálogo de películas.
 *
 * Mantiene lógica simple y delega la lectura al repositorio de Movie.
 */
class MovieService implements IMovieService {
    /**
     * Obtiene el catálogo general de películas.
     */
    async getAll(): Promise<Movie[]> {
        return await movieRepository.findAll();
    }
}

export default new MovieService();
