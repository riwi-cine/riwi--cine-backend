import Movie from "../models/movie.model";
import repository from "../repositories/movie.repository";
import { IMovieService } from "./interfaces/movie.service.interface";

/**
 * Servicio de Películas
 * --------------------
 * Contiene la lógica de negocio relacionada con el catálogo general,
 * la consulta de detalles y recomendaciones de películas.
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
     * Obtiene el catálogo general de películas ordenadas alfabéticamente.
     */
    async getAll(): Promise<Movie[]> {
        return await repository.findAll();
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
     * Obtiene recomendaciones de películas similares a partir de géneros.
     */
    async findRecommendations(movieId: number): Promise<Movie[]> {
        const movie = await repository.findDetailById(movieId);
        if (!movie) {
            throw new Error("Película no encontrada.");
        }

        return await repository.findRecommendations(movieId);
    }

    async getUpcoming(countryId: number, cityId?: number): Promise<any[]> {
        const results = await repository.findUpcoming(countryId);

        return results.map((r: any) => ({
            ...r,
            trailerUrl: this.normalizeTrailerUrl(r.trailerUrl),
        }));
    }

    async getUpcomingDetail(movieId: number, countryId: number): Promise<any> {
        const detail = await repository.findUpcomingDetail(movieId, countryId);

        if (!detail) {
            throw new Error("Próximo estreno no encontrado para el país especificado.");
        }

        detail.trailerUrl = this.normalizeTrailerUrl(detail.trailerUrl);

        return detail;
    }
}

export default new MovieService();