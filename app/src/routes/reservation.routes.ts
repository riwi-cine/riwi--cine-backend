// app/src/routes/reservation.routes.ts

/**
 * Rutas de Reserva Temporal de Sillas (HU-010)
 * -------------------------------------------
 * Se monta bajo `/api/reservations` y administra el bloqueo temporal de
 * sillas mientras el usuario completa la compra.
 *
 * Endpoints disponibles:
 *  - `POST   /reservations/lock-seats`    : Bloquear temporalmente sillas.
 *  - `DELETE /reservations/release-seats`  : Liberar sillas bloqueadas.
 *  - `GET    /reservations/summary`        : Resumen económico de la selección.
 */

import { Router } from "express";
import {
    lockSeats,
    releaseSeats,
    getReservationSummary,
} from "../controllers/seat.controller";

const router = Router();

/**
 * POST /lock-seats
 * -------
 * Bloquea temporalmente las sillas seleccionadas por un carrito (RN-039: 10 minutos).
 *
 * @swagger
 * /api/reservations/lock-seats:
 *   post:
 *     summary: Bloquear temporalmente sillas
 *     description: >
 *       Reserva por 10 minutos las sillas seleccionadas para un carrito.
 *       Rechaza las sillas vendidas, inhabilitadas o ya tomadas por otro usuario.
 *       El índice único `(function_id, seat_id)` evita la doble venta ante compras simultáneas.
 *     tags: [Seats]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [functionId, cartId, seatIds]
 *             properties:
 *               functionId:
 *                 type: integer
 *                 example: 1
 *               cartId:
 *                 type: integer
 *                 example: 7
 *               seatIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [11, 12, 13]
 *     responses:
 *       200:
 *         description: Se bloqueó al menos una silla.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 functionId:
 *                   type: integer
 *                   example: 1
 *                 cartId:
 *                   type: integer
 *                   example: 7
 *                 lockedSeatIds:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   example: [11, 12]
 *                 rejectedSeatIds:
 *                   type: array
 *                   items:
 *                     type: integer
 *                   example: [13]
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-09-05T19:10:00.000Z"
 *       400:
 *         description: Datos inválidos o sillas que no pertenecen a la sala / inhabilitadas.
 *       404:
 *         description: Función no encontrada, inactiva o ya iniciada.
 *       409:
 *         description: Ninguna de las sillas seleccionadas está disponible.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/lock-seats", lockSeats);

/**
 * DELETE /release-seats
 * -------
 * Libera las sillas bloqueadas por un carrito (RN-040). Si se omite `seatIds`
 * se liberan todas las sillas del carrito para esa función.
 *
 * @swagger
 * /api/reservations/release-seats:
 *   delete:
 *     summary: Liberar sillas bloqueadas
 *     tags: [Seats]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [functionId, cartId]
 *             properties:
 *               functionId:
 *                 type: integer
 *                 example: 1
 *               cartId:
 *                 type: integer
 *                 example: 7
 *               seatIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [13]
 *     responses:
 *       200:
 *         description: Sillas liberadas correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 functionId:
 *                   type: integer
 *                   example: 1
 *                 cartId:
 *                   type: integer
 *                   example: 7
 *                 releasedCount:
 *                   type: integer
 *                   example: 1
 *       400:
 *         description: Datos inválidos.
 *       500:
 *         description: Error interno del servidor.
 */
router.delete("/release-seats", releaseSeats);

/**
 * GET /summary
 * -------
 * Devuelve el resumen económico de las sillas bloqueadas por un carrito.
 *
 * @swagger
 * /api/reservations/summary:
 *   get:
 *     summary: Resumen de la selección de sillas
 *     tags: [Seats]
 *     parameters:
 *       - in: query
 *         name: functionId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 1
 *       - in: query
 *         name: cartId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 7
 *     responses:
 *       200:
 *         description: Resumen calculado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 functionId:
 *                   type: integer
 *                   example: 1
 *                 cartId:
 *                   type: integer
 *                   example: 7
 *                 seatCount:
 *                   type: integer
 *                   example: 2
 *                 basePrice:
 *                   type: number
 *                   example: 20000
 *                 roomExtraPrice:
 *                   type: number
 *                   example: 6000
 *                 unitPrice:
 *                   type: number
 *                   example: 26000
 *                 total:
 *                   type: number
 *                   example: 52000
 *                 expiresAt:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                   example: "2026-09-05T19:10:00.000Z"
 *                 lines:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       seatId:
 *                         type: integer
 *                         example: 11
 *                       row:
 *                         type: string
 *                         example: "B"
 *                       number:
 *                         type: string
 *                         example: "3"
 *                       category:
 *                         type: string
 *                         example: "STANDARD"
 *                       unitPrice:
 *                         type: number
 *                         example: 26000
 *       400:
 *         description: Datos inválidos.
 *       404:
 *         description: Función no encontrada, inactiva o ya iniciada.
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/summary", getReservationSummary);

export default router;
