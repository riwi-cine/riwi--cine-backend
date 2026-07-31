// app/src/routes/user.routes.ts

/**
 * Rutas de Autenticacion
 * ----------------
 * Este archivo define las rutas HTTP relacionadas con la entidad `Auth`.
 * 
 * Endpoints disponibles:
 *  - `POST /auth/login`  : Buscar un usuario específico por email.
 * 
 * Cada ruta se conecta con su respectivo controlador.
 */

import { Router } from 'express';
import { findUser } from '../controllers/user.controller';

const router = Router();

/**
 * POST /login
 * ------------
 * Busca un usuario específico utilizando los criterios enviados en el body.
 * 
 * @swagger
 * /api/Auth/login:
 *   post:
 *     summary: Buscar un usuario por email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password: 
 *                 type: string 
 *                 example: "********"
 *     responses:
 *       200:
 *         description: Usuario encontrado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: "John Doe"
 *               email: "john.doe@example.com"
 *               password: "********"
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             example:
 *               error: "Usuario no encontrado"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al buscar el usuario"
 *         
 */
router.post("/login", findUser);

export default router