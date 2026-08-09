// app/src/routes/user.routes.ts

/**
 * Rutas de Usuario
 * ----------------
 * Este archivo define las rutas HTTP relacionadas con la entidad `User`.
 * 
 * Endpoints disponibles:
 *  - `POST /users/`        : Crear un nuevo usuario.
 *  - `PATCH /users/:id`    : Actualizar un usuario por ID.
 *  - `GET /users/`         : Obtener todos los usuarios registrados.
 *  - `POST /users/search`  : Buscar un usuario específico por email.
 * 
 * Cada ruta se conecta con su respectivo controlador.
 */

import { Router } from "express";
import { createUser, getUsers, deleteUser, restoreUser, updateUser } from "../controllers/user.controller";

const router = Router();

/**
 * POST /
 *
 * ---
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
 *               - country
 *               - passwordHash
 *               - email
 *               - firstName
 *               - lastName
 *               - phone
 *               - birthDate
 *               - marketingOptIn
 *             properties:
 *               country:
 *                 type: string
 *                 example: "Barranquilla"
 *               passwordHash:
 *                 type: string
 *                 example: "password123"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "luisreyes@example.com"
 *               firstName:
 *                 type: string
 *                 example: "Luis"
 *               lastName:
 *                 type: string
 *                 example: "Reyes"
 *               phone:
 *                 type: string
 *                 example: "3025949099"
 *               birthDate:
 *                 type: string
 *                 format: date
 *                 example: "1999-04-05"
 *               marketingOptIn:
 *                 type: boolean
 *                 example: true
 *
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               countryId: 57
 *               email: "luisreyes@example.com"
 *               firstName: "Luis"
 *               lastName: "Reyes"
 *               phone: "3025949099"
 *               birthDate: "1999-04-05T00:00:00.000Z"
 *               emailVerified: false
 *               marketingOptIn: true
 *               status: "active"
 *               failedAttempts: 0
 *               lockedUntil: null
 *
 *       400:
 *         description: Datos inválidos
 *         content:
 *           application/json:
 *             example:
 *               error: "El correo ya existe"
 *
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "No se pudo crear el usuario"
 */
router.post("/", createUser);

/**
 * PATCH /:id
 * ----------
 * Actualiza la información de un usuario existente.
 * 
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: Actualizar un usuario por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe Actualizado"
 *               email:
 *                 type: string
 *                 example: "john.actualizado@example.com"
 *               phoneNumber:
 *                 type: string
 *                 example: "3109876543"
 *               password:
 *                 type: string
 *                 example: "nuevapass123"
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 */
router.patch("/:id", updateUser);

/**
 * GET /
 *
 * ---
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
 *                 countryId: 57
 *                 email: "luisreyes@example.com"
 *                 firstName: "Luis"
 *                 lastName: "Reyes"
 *                 phone: "3025949099"
 *                 birthDate: "1999-04-05T00:00:00.000Z"
 *                 emailVerified: false
 *                 marketingOptIn: true
 *                 status: "active"
 *                 failedAttempts: 0
 *                 lockedUntil: null
 *               - id: 2
 *                 countryId: 57
 *                 email: "david@example.com"
 *                 firstName: "David"
 *                 lastName: "Doe"
 *                 phone: "3109876543"
 *                 birthDate: "1998-08-20T00:00:00.000Z"
 *                 emailVerified: true
 *                 marketingOptIn: false
 *                 status: "active"
 *                 failedAttempts: 0
 *                 lockedUntil: null
 *
 *       400:
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             example:
 *               error: "Parámetros incorrectos"
 *
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al obtener los usuarios"
 */
router.get("/", getUsers);

/**
 * DELETE /:id
 * -----------
 * Elimina a usuarios registrados en la base de datos.
 * 
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Eliminar usuarios por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a eliminar
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente 
 *         content:
 *           application/json:
 *             example:
 *               message: "Usuario eliminado correctamente"
 *               id: 1
 *       400:
 *         description: Solicitud inválida
 *         content:
 *           application/json:
 *             example:
 *               error: "Parámetros incorrectos"
 *       404:
 *         description: Usuario no encontrado
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al eliminar al usuario"
 *
 */
router.delete("/:id", deleteUser)


/**
 * POST /:id/restore
 * -----------------
 * Restaura a usuarios registrados en la base de datos.
 * 
 * @swagger
 * /api/users/{id}/restore:
 *   post:
 *     summary: Restaurar usuarios por ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del usuario a restaurar
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Usuario restaurado exitosamente 
 *         content:
 *           application/json:
 *             example:
 *               message: "Usuario restaurado correctamente"
 *               id: 1
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
router.post('/:id/restore', restoreUser)
export default router;
