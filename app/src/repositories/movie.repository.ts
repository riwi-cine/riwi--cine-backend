// app/src/repositories/movie.repository.ts

import { Op } from "sequelize";
import Movie from "../models/movie.model";
import { IMovieRepository } from "./interfaces/movie.repository.interface";

/**
 * Repositorio de catálogo de películas.
 *
 * Mantiene consultas simples contra Movie. No incluye funciones, salas,
 * cines ni agregaciones de cartelera para que pueda reutilizarse en HU-FE-004.
 */
class MovieRepository implements IMovieRepository {
    /**
     * Obtiene todas las películas ordenadas alfabéticamente.
     */
    async findAll(): Promise<Movie[]> {
        return await Movie.findAll({
            order: [["title", "ASC"]],
        });
    }

    /**
     * Obtiene una película por ID.
     */
    async findById(id: number): Promise<Movie> {
        const movie = await Movie.findByPk(id);

        if (!movie) {
            throw new Error("Película no encontrada");
        }

        return movie;
    }

    /**
     * Busca películas por coincidencia parcial de título.
     */
    async findByTitle(title: string): Promise<Movie[]> {
        return await Movie.findAll({
            where: {
                title: {
                    [Op.iLike]: `%${title}%`,
                },
            },
            order: [["title", "ASC"]],
        });
    }
}

export default new MovieRepository();
