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
import { EmailVerificationController } from '../controllers/emailVerification.controller';

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
 *                 example: "luisreyes@example.com"
 *               password: 
 *                 type: string 
 *                 example: "password123@"
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
router.post("/logout", logout);

/**
 * @swagger
 * /api/auth/verify-email:
 *   get:
 *     summary: Verificar correo electrónico
 *     tags: [User_Auth]
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token enviado al correo del usuario
 *     responses:
 *       200:
 *         description: Correo verificado correctamente
 *         content:
 *           application/json:
 *             example:
 *               message: "Correo verificado con éxito."
 *               userId: 1
 *       400:
 *         description: Token inválido, expirado o ausente
 *       404:
 *         description: Usuario asociado al token no encontrado
 *       500:
 *         description: Error interno al verificar el correo
 */
router.get("/verify-email", EmailVerificationController.verifyEmail);

/**
 * @swagger
 * /api/auth/resend-verification:
 *   post:
 *     summary: Reenviar enlace de verificación por correo
 *     tags: [User_Auth]
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
 *                 example: usuario@correo.com
 *     responses:
 *       200:
 *         description: Solicitud procesada; puede incluir warning si falla SMTP
 *         content:
 *           application/json:
 *             examples:
 *               enviado:
 *                 value:
 *                   message: "Nuevo enlace de confirmación enviado."
 *               smtp_fallido:
 *                 value:
 *                   message: "Nuevo enlace de confirmación enviado."
 *                   warning: "El correo no pudo enviarse en este momento, pero el token sigue disponible para validación."
 *       400:
 *         description: Faltan userId o email
 *       500:
 *         description: Error interno al reenviar el correo
 */
router.post("/resend-verification", EmailVerificationController.resendEmail);


export default router