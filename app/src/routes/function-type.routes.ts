// app/src/routes/function-type.routes.ts

/**
 * Rutas de Tipos de Función (FunctionType)
 *
 * ----------------
 * Este archivo define las rutas HTTP relacionadas con la entidad `FunctionType`.
 *
 * Endpoints disponibles:
 *  - `GET /function-types/`               : Obtener todos los tipos de función registrados.
 *  - `POST /function-types/create_function_type` : Crear un nuevo tipo de función.
 *  - `PATCH /function-types/:id`          : Actualizar un tipo de función por ID.
 *  - `DELETE /function-types/:id`         : Eliminar un tipo de función (soft-delete).
 *  - `POST /function-types/restore/:id`   : Restaurar un tipo de función eliminado.
 *
 * Cada ruta se conecta con su respectivo controlador.
 */

import { Router } from "express";
import {
  createFunctionType,
  getFunctionTypes,
  updateFunctionType,
  deleteFunctionType,
  restoreFunctionType,
} from "../controllers/function-type.controller";

const router = Router();

/**
 * GET /
 * -------
 * Obtiene todos los tipos de función registrados.
 * @swagger
 * /api/function-types:
 *   get:
 *     summary: Obtener todos los tipos de función
 *     tags: [FunctionTypes]
 *     responses:
 *       200:
 *         description: Lista de tipos de función obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "2D Doblada Español Latino"
 *                   projection:
 *                     type: string
 *                     example: "2D"
 *                   language:
 *                     type: string
 *                     example: "Español Latino"
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get("/", getFunctionTypes);

/**
 * POST /create_function_type
 * --------------------------
 * Crea un nuevo tipo de función en la base de datos.
 *
 * @swagger
 * /api/function-types/create_function_type:
 *   post:
 *     summary: Crear un nuevo tipo de función
 *     tags: [FunctionTypes]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - projection
 *               - language
 *             properties:
 *               name:
 *                 type: string
 *                 example: "2D Doblada Español Latino"
 *               projection:
 *                 type: string
 *                 example: "2D"
 *               language:
 *                 type: string
 *                 example: "Español Latino"
 *     responses:
 *       201:
 *         description: Tipo de función creado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: "2D Doblada Español Latino"
 *               projection: "2D"
 *               language: "Español Latino"
 *       400:
 *         description: Datos inválidos o error al procesar la solicitud.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post("/create_function_type", createFunctionType);

/**
 * PATCH /:id
 * ----------
 * Actualiza la información de un tipo de función existente.
 *
 * @swagger
 * /api/function-types/{id}:
 *   patch:
 *     summary: Actualizar un tipo de función por ID
 *     tags: [FunctionTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del tipo de función a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "3D Subtitulada"
 *               projection:
 *                 type: string
 *                 example: "3D"
 *               language:
 *                 type: string
 *                 example: "Inglés con Subtítulos"
 *     responses:
 *       200:
 *         description: Tipo de función actualizado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               name: "3D Subtitulada"
 *               projection: "3D"
 *               language: "Inglés con Subtítulos"
 *       400:
 *         description: Error al actualizar o datos inválidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.patch("/:id", updateFunctionType);

/**
 * DELETE /:id
 * -----------
 * Elimina un tipo de función existente por su ID (soft-delete).
 *
 * @swagger
 * /api/function-types/{id}:
 *   delete:
 *     summary: Eliminar un tipo de función por ID
 *     tags: [FunctionTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del tipo de función a eliminar
 *     responses:
 *       200:
 *         description: Tipo de función finalizado o ya no disponible.
 *         content:
 *           application/json:
 *             example:
 *               message: "El tipo de función finalizó o ya no esta disponible"
 *       400:
 *         description: Error al eliminar el tipo de función.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.delete("/:id", deleteFunctionType);

/**
 * POST /restore/:id
 * -----------------
 * Restaura un tipo de función eliminado previamente por su ID.
 *
 * @swagger
 * /api/function-types/restore/{id}:
 *   post:
 *     summary: Restaurar un tipo de función eliminado por ID
 *     tags: [FunctionTypes]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del tipo de función a restaurar
 *     responses:
 *       200:
 *         description: Tipo de función restaurado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               message: "tipo de función restaurada"
 *               functionTypeResored:
 *                 id: 1
 *                 name: "2D Doblada Español Latino"
 *                 projection: "2D"
 *                 language: "Español Latino"
 *       400:
 *         description: Error al restaurar el tipo de función.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post("/restore/:id", restoreFunctionType);

export default router;
