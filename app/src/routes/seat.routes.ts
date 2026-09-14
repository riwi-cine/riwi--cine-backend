// app/src/routes/seat.routes.ts

/**
 * Rutas del Mapa de Sillas (HU-010)
 * --------------------------------
 * Se monta bajo `/api/functions` y expone la consulta del plano de la sala
 * de una función con el estado en tiempo real de cada silla.
 *
 * Endpoint disponible:
 *  - `GET /functions/:id/seats` : Obtener el mapa de sillas de una función.
 */

import { Router } from "express";
import { getFunctionSeatMap } from "../controllers/seat.controller";

const router = Router();

/**
 * GET /:id/seats
 * -------
 * Obtiene el plano de la sala de una función con el estado de cada silla.
 *
 * @swagger
 * /api/functions/{id}/seats:
 *   get:
 *     summary: Obtener el mapa de sillas de una función
 *     description: >
 *       Devuelve la distribución real de la sala de una función activa y futura.
 *       Cada silla incluye su categoría (STANDARD, VIP, PREFERENTIAL, DISABLED)
 *       y su estado calculado en tiempo real (AVAILABLE, SELECTED, LOCKED, SOLD, DISABLED).
 *     tags: [Seats]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la función
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *       - in: query
 *         name: cartId
 *         required: false
 *         description: ID del carrito actual. Sus bloqueos vigentes se devuelven como SELECTED.
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 7
 *     responses:
 *       200:
 *         description: Mapa de sillas obtenido correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 functionId:
 *                   type: integer
 *                   example: 1
 *                 room:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     name:
 *                       type: string
 *                       example: "Sala HU-010"
 *                     capacity:
 *                       type: integer
 *                       example: 40
 *                 maxSeatsPerReservation:
 *                   type: integer
 *                   example: 10
 *                 availableCount:
 *                   type: integer
 *                   example: 34
 *                 seats:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 12
 *                       row:
 *                         type: string
 *                         example: "B"
 *                       number:
 *                         type: string
 *                         example: "4"
 *                       category:
 *                         type: string
 *                         enum: [STANDARD, VIP, PREFERENTIAL, DISABLED]
 *                         example: "STANDARD"
 *                       status:
 *                         type: string
 *                         enum: [AVAILABLE, SELECTED, LOCKED, SOLD, DISABLED]
 *                         example: "AVAILABLE"
 *                       lockedUntil:
 *                         type: string
 *                         format: date-time
 *                         nullable: true
 *                         example: null
 *       400:
 *         description: El id de la función o del carrito no es válido.
 *       404:
 *         description: Función no encontrada, inactiva o ya iniciada.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/:id/seats", getFunctionSeatMap);

export default router;
