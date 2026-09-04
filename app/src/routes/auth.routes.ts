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

import { Router } from "express";
import { findUser } from "../controllers/auth.controller";
import { EmailVerificationController } from "../controllers/emailVerification.controller";

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
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: OK
 *         content:
 *           application/json:
 *             example:
 *               message: "sesion cerrada exitosamente"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al cerrar sesion"
 *
 */
/**
 * GET /verify-email
 * -----------------
 * Verifica la cuenta del usuario usando el token enviado por correo.
 *
 * @swagger
 * /api/auth/verify-email:
 *   get:
 *     summary: Verificar correo electrónico
 *     tags: [Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token de verificación enviado al correo del usuario
 *     responses:
 *       200:
 *         description: Correo verificado correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Correo verificado con éxito."
 *               userId: 1
 *       400:
 *         description: Token inválido, expirado o no enviado
 *         content:
 *           application/json:
 *             example:
 *               message: "Token de verificación no proporcionado o inválido."
 *       404:
 *         description: Usuario asociado al token no existe
 *         content:
 *           application/json:
 *             example:
 *               message: "Usuario no encontrado para este token."
 *       500:
 *         description: Error interno del servidor
 */
router.get("/verify-email", EmailVerificationController.verifyEmail);

/**
 * POST /resend-verification
 * ------------------------
 * Reenvía un nuevo enlace de verificación al correo del usuario.
 *
 * @swagger
 * /api/auth/resend-verification:
 *   post:
 *     summary: Reenviar enlace de verificación
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - email
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Enlace de verificación reenviado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Nuevo enlace de confirmación enviado."
 *       400:
 *         description: Datos requeridos faltantes
 *         content:
 *           application/json:
 *             example:
 *               message: "Se requieren userId y email para reenviar la verificación."
 *       500:
 *         description: Error interno del servidor
 */
router.post("/resend-verification", EmailVerificationController.resendEmail);

export default router;
