// app/src/controllers/movies.controller.ts

import { Request, Response } from "express";
import { BillboardQueryDto } from "../dto/billboard/billboard-query.dto";
import billboardService from "../services/billboard.service";
import movieService from "../services/movie.service";

/**
 * Obtiene el catálogo simple de películas.
 */
export const getMovies = async (_req: Request, res: Response): Promise<void> => {
    try {
        const movies = await movieService.getAll();
        res.status(200).json(movies);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
};

/**
 * Obtiene la cartelera de los próximos 7 días para una ciudad.
 */
export const getWeeklyBillboard = async (req: Request, res: Response): Promise<void> => {
    try {
        const cityId = parseRequiredId(req.query.cityId, "cityId");
        const cards = await billboardService.getBillboard({ cityId });
        res.status(200).json(cards);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

/**
 * Obtiene la cartelera de hoy para una ciudad.
 *
 * La estructura de schedules conserva los 7 días fijos de RN-012; solo se
 * incluyen funciones del día actual.
 */
export const getTodayBillboard = async (req: Request, res: Response): Promise<void> => {
    try {
        const cityId = parseRequiredId(req.query.cityId, "cityId");
        const today = toDateOnly(new Date());
        const cards = await billboardService.getBillboard({ cityId, date: today });
        res.status(200).json(cards);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

/**
 * Obtiene cartelera filtrada por ciudad, fecha, género, clasificación, idioma,
 * tipo de sala, formato, cine y disponibilidad.
 */
export const getFilteredBillboard = async (req: Request, res: Response): Promise<void> => {
    try {
        const params: BillboardQueryDto = {
            cityId: parseRequiredId(req.query.cityId, "cityId"),
            date: parseOptionalString(req.query.date),
            genre: parseOptionalString(req.query.genre),
            classification: parseOptionalString(req.query.classification),
            language: parseOptionalString(req.query.language),
            roomType: parseOptionalString(req.query.roomType),
            format: parseOptionalString(req.query.format),
            cinemaId: parseOptionalId(req.query.cinemaId),
            availableOnly: parseOptionalBoolean(req.query.availableOnly),
        };

        const cards = await billboardService.getBillboard(params);
        res.status(200).json(cards);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
};

const parseRequiredId = (value: unknown, fieldName: string): number => {
    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error(`${fieldName} es obligatorio y debe ser un número válido`);
    }

    return parsed;
};

const parseOptionalId = (value: unknown): number | undefined => {
    if (value === undefined) {
        return undefined;
    }

    const parsed = Number(value);

    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new Error("cinemaId debe ser un número válido");
    }

    return parsed;
};

const parseOptionalBoolean = (value: unknown): boolean | undefined => {
    if (value === undefined) {
        return undefined;
    }

    if (value === "true" || value === true) {
        return true;
    }

    if (value === "false" || value === false) {
        return false;
    }

    throw new Error("availableOnly debe ser true o false");
};

const parseOptionalString = (value: unknown): string | undefined => {
    if (typeof value !== "string" || value.trim() === "") {
        return undefined;
    }

    return value.trim();
};

const toDateOnly = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

/**
 * Detalle, funciones y recomendaciones de película (fusionado desde movie.controller.ts)
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
