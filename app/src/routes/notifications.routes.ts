// app/src/routes/notifications.routes.ts

import { Router } from "express";
import notificationsController from "../controllers/notifications.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/notifications/upcoming:
 *   post:
 *     summary: Registrar notificación de próximo estreno para el usuario autenticado
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               movieId:
 *                 type: integer
 *                 description: ID de la película
 *                 example: 123
 *               cityId:
 *                 type: integer
 *                 description: ID de la ciudad (opcional)
 *                 example: 10
 *     responses:
 *       201:
 *         description: Solicitud creada
 *       200:
 *         description: Ya existe una solicitud para esta película
 *       400:
 *         description: Parámetros inválidos
 *       401:
 *         description: Usuario no autenticado
 */
router.post("/upcoming", authMiddleware, notificationsController.registerUpcomingNotification);

export default router;
