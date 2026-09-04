import { Router } from "express";
import {
  getFunctionById,
  getFunctionFinalPrice,
  createFunction,
  updateFunction,
  deleteFunction,
  restoreFunction,
} from "../controllers/function.controller";

const router = Router();

/**
 * GET /:id
 * -------
 * Obtiene el detalle de una función de cine.
 *
 * @swagger
 * /api/functions/{id}:
 *   get:
 *     summary: Obtener el detalle de una función
 *     description: Obtiene una función activa y futura junto con la información de su tipo, sala, cine, ciudad, película y disponibilidad.
 *     tags: [Functions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la función
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 15
 *     responses:
 *       200:
 *         description: Función encontrada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 15
 *                 startsAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-08-30T19:30:00.000Z"
 *                 basePrice:
 *                   type: number
 *                   format: float
 *                   example: 15000
 *                 active:
 *                   type: boolean
 *                   example: true
 *                 functionType:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "2D Doblada"
 *                     projection:
 *                       type: string
 *                       example: "2D"
 *                     language:
 *                       type: string
 *                       example: "Español"
 *                 room:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     name:
 *                       type: string
 *                       example: "Sala 3"
 *                     capacity:
 *                       type: integer
 *                       example: 120
 *                     extraPrice:
 *                       type: number
 *                       format: float
 *                       example: 3000
 *                     roomType:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 2
 *                         name:
 *                           type: string
 *                           example: "VIP"
 *                         description:
 *                           type: string
 *                           example: "Sala con asientos reclinables"
 *                     cinema:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Cine Colombia"
 *                         address:
 *                           type: string
 *                           example: "Calle 72 # 54-20"
 *                         city:
 *                           type: object
 *                           nullable: true
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             name:
 *                               type: string
 *                               example: "Barranquilla"
 *                 movieRelease:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     releaseDate:
 *                       type: string
 *                       format: date
 *                       example: "2026-08-20"
 *                     countryId:
 *                       type: integer
 *                       example: 1
 *                     movie:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 25
 *                         title:
 *                           type: string
 *                           example: "Avengers: Secret Wars"
 *                 ticketsCount:
 *                   type: integer
 *                   example: 80
 *                 seatLocksCount:
 *                   type: integer
 *                   example: 5
 *                 isSoldOut:
 *                   type: boolean
 *                   nullable: true
 *                   example: false
 *       400:
 *         description: El ID proporcionado no es válido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El id de la función debe ser un número válido."
 *       404:
 *         description: Función no encontrada, inactiva o ya iniciada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Función no encontrada."
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/:id", getFunctionById);

/**
 * GET /:id/prices
 * -------
 * Obtiene el precio de una función específica.
 *
 * @swagger
 * /api/functions/{id}/prices:
 *   get:
 *     summary: Obtener el precio de una función
 *     description: Obtiene el precio base, el recargo de la sala y el precio final de una función activa y futura.
 *     tags: [Functions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la función
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 15
 *     responses:
 *       200:
 *         description: Precio de la función obtenido exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 functionId:
 *                   type: integer
 *                   example: 15
 *                 basePrice:
 *                   type: number
 *                   format: float
 *                   example: 15000
 *                 roomExtraPrice:
 *                   type: number
 *                   format: float
 *                   example: 3000
 *                 finalPrice:
 *                   type: number
 *                   format: float
 *                   example: 18000
 *       400:
 *         description: El ID proporcionado no es válido.
 *       404:
 *         description: Función no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/:id/prices", getFunctionFinalPrice);

/**
 * POST /
 * -------
 * Crea una nueva función de cine.
 *
 * @swagger
 * /api/functions:
 *   post:
 *     summary: Crear una función de cine
 *     tags: [Functions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startsAt
 *               - basePrice
 *             properties:
 *               movieId:
 *                 type: integer
 *                 example: 25
 *               roomId:
 *                 type: integer
 *                 example: 3
 *               functionTypeId:
 *                 type: integer
 *                 example: 1
 *               startsAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-08-30T19:30:00.000Z"
 *               basePrice:
 *                 type: number
 *                 format: float
 *                 example: 15000
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Función creada exitosamente.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/", createFunction);

/**
 * PUT /:id
 * -------
 * Actualiza una función de cine.
 *
 * @swagger
 * /api/functions/{id}/update:
 *   patch:
 *     summary: Actualizar una función de cine
 *     tags: [Functions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la función
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 15
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: integer
 *                 example: 25
 *               roomId:
 *                 type: integer
 *                 example: 3
 *               functionTypeId:
 *                 type: integer
 *                 example: 1
 *               startsAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2026-08-30T21:00:00.000Z"
 *               basePrice:
 *                 type: number
 *                 format: float
 *                 example: 18000
 *               active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Función actualizada exitosamente.
 *       400:
 *         description: El ID proporcionado no es válido.
 *       404:
 *         description: Función no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
router.patch("/:id/update", updateFunction);

/**
 * DELETE /:id
 * -------
 * Elimina una función mediante soft-delete.
 *
 * @swagger
 * /api/functions/{id}/delete:
 *   delete:
 *     summary: Eliminar una función
 *     tags: [Functions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la función
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 15
 *     responses:
 *       200:
 *         description: Función eliminada correctamente.
 *       400:
 *         description: El ID proporcionado no es válido.
 *       404:
 *         description: Función no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete("/:id/delete", deleteFunction);

/**
 * PATCH /:id/restore
 * -------
 * Restaura una función eliminada mediante soft-delete.
 *
 * @swagger
 * /api/functions/{id}/restore:
 *   patch:
 *     summary: Restaurar una función
 *     tags: [Functions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la función
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 15
 *     responses:
 *       200:
 *         description: Función restaurada correctamente.
 *       400:
 *         description: El ID proporcionado no es válido.
 *       404:
 *         description: Función no encontrada.
 *       500:
 *         description: Error interno del servidor.
 */
router.patch("/:id/restore", restoreFunction);

export default router;
