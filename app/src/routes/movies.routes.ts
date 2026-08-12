// app/src/routes/movies.routes.ts

import { Router } from "express";
import {
    getFilteredBillboard,
    getMovies,
    getTodayBillboard,
    getWeeklyBillboard,
} from "../controllers/movies.controller";

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     BillboardFunctionSchedule:
 *       type: object
 *       properties:
 *         functionId:
 *           type: integer
 *           example: 12
 *         startsAt:
 *           type: string
 *           format: date-time
 *           example: "2026-08-12T19:30:00.000Z"
 *         time:
 *           type: string
 *           example: "19:30"
 *         cinemaId:
 *           type: integer
 *           example: 1
 *         cinemaName:
 *           type: string
 *           example: "Riwi Cine Medellin Centro"
 *         roomId:
 *           type: integer
 *           example: 2
 *         roomName:
 *           type: string
 *           example: "Sala 2"
 *         roomType:
 *           type: string
 *           example: "IMAX"
 *         format:
 *           type: string
 *           example: "IMAX"
 *         language:
 *           type: string
 *           example: "Subtitulada"
 *         availableSeats:
 *           type: integer
 *           example: 28
 *         isSoldOut:
 *           type: boolean
 *           example: false
 *     BillboardSchedule:
 *       type: object
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           example: "2026-08-12"
 *         functions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/BillboardFunctionSchedule'
 *     BillboardCard:
 *       type: object
 *       properties:
 *         movieId:
 *           type: integer
 *           example: 1
 *         title:
 *           type: string
 *           example: "El Último Portal"
 *         posterUrl:
 *           type: string
 *           example: "https://example.com/posters/ultimo-portal.jpg"
 *         genres:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Ciencia ficción", "Aventura"]
 *         classification:
 *           type: string
 *           example: "12+"
 *         durationMin:
 *           type: integer
 *           example: 128
 *         director:
 *           type: string
 *           example: "Ana Torres"
 *         language:
 *           type: string
 *           example: "Subtitulada"
 *         dubbedOrSubtitled:
 *           type: string
 *           example: "Subtitulada, Doblada"
 *         formats:
 *           type: array
 *           items:
 *             type: string
 *           example: ["2D", "IMAX"]
 *         schedules:
 *           type: array
 *           description: Siempre contiene 7 días fijos desde hoy.
 *           items:
 *             $ref: '#/components/schemas/BillboardSchedule'
 *         rating:
 *           type: number
 *           example: 4.6
 *         isNewRelease:
 *           type: boolean
 *           example: true
 *         isSoldOut:
 *           type: boolean
 *           example: false
 */

/**
 * @swagger
 * /api/movies:
 *   get:
 *     summary: Obtener catálogo general de películas
 *     description: No requiere cityId y no consulta funciones, salas ni cines.
 *     tags: [Movies]
 *     responses:
 *       200:
 *         description: Catálogo obtenido exitosamente.
 */
router.get("/", getMovies);

/**
 * @swagger
 * /api/movies/weekly:
 *   get:
 *     summary: Obtener cartelera semanal por ciudad
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: cityId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la ciudad.
 *     responses:
 *       200:
 *         description: Cartelera obtenida. Array vacío si la ciudad no tiene funciones.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BillboardCard'
 *       400:
 *         description: cityId inválido o inexistente.
 */
router.get("/weekly", getWeeklyBillboard);

/**
 * @swagger
 * /api/movies/today:
 *   get:
 *     summary: Obtener cartelera de hoy por ciudad
 *     description: Devuelve schedules con 7 días fijos; solo trae funciones de hoy.
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: cityId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Cartelera de hoy obtenida.
 *       400:
 *         description: cityId inválido o inexistente.
 */
router.get("/today", getTodayBillboard);

/**
 * @swagger
 * /api/movies/filter:
 *   get:
 *     summary: Filtrar cartelera
 *     tags: [Movies]
 *     parameters:
 *       - in: query
 *         name: cityId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: YYYY-MM-DD. Si no viene, usa próximos 7 días.
 *       - in: query
 *         name: genre
 *         schema:
 *           type: string
 *       - in: query
 *         name: classification
 *         schema:
 *           type: string
 *       - in: query
 *         name: language
 *         schema:
 *           type: string
 *       - in: query
 *         name: roomType
 *         schema:
 *           type: string
 *       - in: query
 *         name: format
 *         schema:
 *           type: string
 *       - in: query
 *         name: cinemaId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: availableOnly
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Cartelera filtrada obtenida.
 *       400:
 *         description: Parámetros inválidos.
 */
router.get("/filter", getFilteredBillboard);

export default router;
