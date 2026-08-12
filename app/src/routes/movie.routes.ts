import { Router } from "express";
import {
    getMovieDetail,
    getMovieFunctions,
    getMovieRecommendations,
} from "../controllers/movie.controller";

const router = Router();

/**
 * Rutas de Películas
 */
router.get("/:id", getMovieDetail);
router.get("/:id/functions", getMovieFunctions);
router.get("/:id/recommendations", getMovieRecommendations);

export default router;
