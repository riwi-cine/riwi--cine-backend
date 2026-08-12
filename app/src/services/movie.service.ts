import Movie from "../models/movie.model";
import repository from "../repositories/movie.repository";
import { IMovieService, MovieFunctionDetail } from "./interfaces/movie.service.interface";

/**
 * Servicio de Películas
 * --------------------
 * Contiene la lógica de negocio relacionada con la consulta
 * de detalles, funciones y recomendaciones de películas.
 */
class MovieService implements IMovieService {
    private normalizeTrailerUrl(trailerUrl: string): string {
        if (!trailerUrl) {
            return trailerUrl;
        }

        const youtubeMatch = trailerUrl.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([A-Za-z0-9_-]{11})/, 
        );

        if (youtubeMatch && youtubeMatch[1]) {
            return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
        }

        return trailerUrl;
    }

    /**
     * Obtiene el detalle de una película por su id.
     *
     * Valida que la película exista y delega la consulta al repositorio.
     */
    async findDetailById(id: number): Promise<Movie> {
        const movie = await repository.findDetailById(id);

        if (!movie) {
            throw new Error("Película no encontrada.");
        }

        movie.trailerUrl = this.normalizeTrailerUrl(movie.trailerUrl);

        return movie;
    }

    /**
     * Obtiene las funciones futuras de una película.
     *
     * Aplica RN-014: solo funciones futuras.
     * Aplica RN-015: devuelve información suficiente para identificar funciones agotadas.
     */
    async findFutureFunctions(
        movieId: number,
        cityId?: number,
    ): Promise<MovieFunctionDetail[]> {
        const movie = await repository.findDetailById(movieId);
        if (!movie) {
            throw new Error("Película no encontrada.");
        }

        const functions = await repository.findFutureFunctions(movieId, cityId);

        return functions.map((func) => ({
            ...func,
            isSoldOut: func.room && func.room.capacity !== undefined
                ? func.ticketsCount >= func.room.capacity
                : false,
        }));
    }

    /**
     * Obtiene recomendaciones de películas similares a partir de géneros.
     */
    async findRecommendations(movieId: number): Promise<Movie[]> {
        const movie = await repository.findDetailById(movieId);
        if (!movie) {
            throw new Error("Película no encontrada.");
        }

        return await repository.findRecommendations(movieId);
    }
}

export default new MovieService();
