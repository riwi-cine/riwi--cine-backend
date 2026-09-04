import Movie from "../../models/movie.model";

/**
 * Contrato del Servicio de Películas
 * ----------------------------------
 * Define la lógica de negocio aplicable al módulo de películas.
 */
export interface IMovieService {
    // Métodos generales del catálogo (de develop)
    getAll(): Promise<Movie[]>;

    // Métodos especializados de cartelera y recomendaciones (de feat/movie)
    findDetailById(id: number): Promise<Movie>;
    findRecommendations(movieId: number): Promise<Movie[]>;
    getUpcoming(countryId: number, cityId?: number): Promise<any[]>;
    getUpcomingDetail(movieId: number, countryId: number): Promise<any>;
}