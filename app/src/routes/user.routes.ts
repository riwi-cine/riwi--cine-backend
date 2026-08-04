// app/src/routes/user.routes.ts

/**
 * Rutas de Usuario
 * ----------------
 * Este archivo define las rutas HTTP relacionadas con la entidad `User`.
 * 
 * Endpoints disponibles:
 *  - `POST /users/`        : Crear un nuevo usuario.
 *  - `GET /users/`         : Obtener todos los usuarios registrados.
 *  - `POST /users/search`  : Buscar un usuario específico por email.
 * 
 * Cada ruta se conecta con su respectivo controlador.
 */

import { Router } from "express";
import { createUser, getUsers, deleteUser, restoreUser } from "../controllers/user.controller";

const router = Router();

/**
 * POST /
 * -----
 * Crea un nuevo usuario en la base de datos.
 * 
 * @swagger
 * /api/users:
 *   post:
 *     summary: Crear un nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "********"
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               name: "John Doe"
 *               email: "john.doe@example.com"
 *               password: "********"
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             example:
 *               error: "El correo ya existe"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "No se pudo crear el usuario"
 */
router.post("/", createUser);

/**
 * GET /
 * ----
 * Obtiene la lista completa de usuarios registrados en la base de datos.
 * 
 * @swagger
 * /api/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista de usuarios obtenida exitosamente
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *                 name: "John Doe"
 *                 email: "john.doe@example.com"
 *                 password: "********"
 *               - id: 2
 *                 name: "Jane Doe"
 *                 email: "john.doe@example.com"
 *                 password: "********"
 *       400:
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             example:
 *               error: "Parámetros incorrectos"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al obtener los usuarios"
 */
router.get("/", getUsers);

/**
 * DELETE /
 * ----
 * Elimina a usuarios registrados en la base de datos.
 * 
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar usuarios por ID
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente 
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *       400:
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             example:
 *               error: "Parámetros incorrectos"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al eliminar al usuario"
 *
 */
router.delete("/{id}", deleteUser)


/**
 * POST /
 * ----
 * Restaura a usuarios registrados en la base de datos.
 * 
 * @swagger
 * /api/users/{id}/restore:
 *   post:
 *     summary: Restaurar usuarios por ID
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Usuario restaurado exitosamente 
 *         content:
 *           application/json:
 *             example:
 *               - id: 1
 *       400:
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             example:
 *               error: "Parámetros incorrectos"
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al restaurar al usuario"
 *
 */
router.post('/{id}/restore', restoreUser)
export default router;
