// app/src/routes/user.routes.ts

/**
 * Rutas de Autenticacion
 * ----------------
 * Este archivo define las rutas HTTP relacionadas con la entidad `Auth`.
 * 
 * Endpoints disponibles:
 *  - `POST /user_auth/login`  : Buscar un usuario específico por email.
 * 
 * Cada ruta se conecta con su respectivo controlador.
 */

import { Router } from 'express';
import { findUser, logout } from '../controllers/auth.controller';

const router = Router();

/**
 * POST /login
 * ------------
 * Busca un usuario específico utilizando los criterios enviados en el body.
 * 
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autenticar usuario y generar token de acceso    
 *     tags: [User_Auth]
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

/**
 * POST /logout
 * ------------
 * Cierra la sesion del usuario.
 * 
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Cierra la sesion del usuario y revoca el token.
 *     tags: [User_Auth]
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
router.post("/logout", logout);


export default router