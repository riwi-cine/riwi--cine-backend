import { Request, Response } from "express";
import movieService from "../services/movie.service";

/**
 * Controlador de Películas
 * -----------------------
 * Gestiona las solicitudes HTTP relacionadas con el detalle,
 * funciones y recomendaciones de películas.
 */

export const getMovieDetail = async (req: Request, res: Response): Promise<Response> => {
    try {
        const id = Number(req.params.id);

        if (Number.isNaN(id) || id <= 0) {
            return res.status(400).json({ error: "El id de la película debe ser un número válido." });
        }

        const movie = await movieService.findDetailById(id);

        return res.status(200).json(movie);
    } catch (error: any) {
        if (error.message === "Película no encontrada.") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};

export const getMovieFunctions = async (req: Request, res: Response): Promise<Response> => {
    try {
        const movieId = Number(req.params.id);

        if (Number.isNaN(movieId) || movieId <= 0) {
            return res.status(400).json({ error: "El id de la película debe ser un número válido." });
        }

        const cityIdParam = req.query.cityId;
        let cityId: number | undefined;

        if (cityIdParam !== undefined) {
            cityId = Number(cityIdParam);
            if (Number.isNaN(cityId) || cityId <= 0) {
                return res.status(400).json({ error: "El id de la ciudad debe ser un número válido." });
            }
        }

        const functions = await movieService.findFutureFunctions(movieId, cityId);

        return res.status(200).json(functions);
    } catch (error: any) {
        if (error.message === "Película no encontrada.") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};

export const getMovieRecommendations = async (req: Request, res: Response): Promise<Response> => {
    try {
        const movieId = Number(req.params.id);

        if (Number.isNaN(movieId) || movieId <= 0) {
            return res.status(400).json({ error: "El id de la película debe ser un número válido." });
        }

        const recommendations = await movieService.findRecommendations(movieId);

        return res.status(200).json(recommendations);
    } catch (error: any) {
        if (error.message === "Película no encontrada.") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};
