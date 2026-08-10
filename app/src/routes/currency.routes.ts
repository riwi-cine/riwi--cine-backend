// app /src/routes/currency.routes.ts

/**
 * Rutas de Moneda
 * 
 * ----------------
 * Este archivo define las rutas HTTP relacionadas con la entidad `Currency`.
 *
 * Endpoints disponibles:
 *  - `POST /currencies/`        : Crear una nueva moneda.
 *  - `PATCH /currencies/:id`    : Actualizar una moneda por ID.
 *  - `GET /currencies/`         : Obtener todas las monedas registradas.
 *  - `POST /currencies/search`  : Buscar una moneda específica por código.
 *
 * Cada ruta se conecta con su respectivo controlador.
 */

import { Router } from "express";
import { createCurrency, getCurrencies , deleteCurrency, restoreCurrency, updateCurrency } from "../controllers/currency.controller";

const router = Router();

/**
 * GET /
 * -------
 * Obtiene todas las monedas registradas.
 * @swagger
 * /api/currencies:
 *   get:
 *     summary: Obtener todas las monedas
 *     tags: [Currencies]
 *     responses:
 *       200:
 *         description: Lista de monedas obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   code:
 *                     type: string
 *                     example: "USD"
 *                   name:
 *                     type: string
 *                     example: "United States Dollar"
 *                   symbol:
 *                     type: string
 *                     example: "$"
 */
router.get("/", getCurrencies);

/**
 * Crea una nueva moneda en la base de datos.
 *
 * @swagger
 * /api/currencies/create_currency:
 *   post:
 *     summary: Crear una nueva moneda
 *     tags: [Currencies]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - name
 *               - symbol
 *             properties:
 *               code:
 *                 type: string
 *                 example: "USD"
 *               name:
 *                 type: string
 *                 example: "United States Dollar"
 *               symbol:
 *                 type: string
 *                 example: "$"
 *     responses:
 *       201:
 *         description: Moneda creada exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               code: "USD"
 *               name: "United States Dollar"
 *               symbol: "$"
 *       400:
 *         description: Datos inválidos o incompletos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "El código de moneda ya se encuentra registrado."
 */
router.post("/create_currency", createCurrency);



/**
 * Actualiza la información de una moneda existente.
 *
 * @swagger
 * /api/currencies/{id}:
 *   patch:
 *     summary: Actualizar una moneda por ID
 *     tags: [Currencies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la moneda a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Dólar estadounidense actualizado"
 *               symbol:
 *                 type: string
 *                 example: "$$"
 *     responses:
 *       200:
 *         description: Moneda actualizada exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               code: "USD"
 *               name: "Dólar estadounidense actualizado"
 *               symbol: "$$"
 *       404:
 *         description: Moneda no encontrada.
 *         content:
 *           application/json:
 *             example:
 *               message: "Moneda no encontrada."
 */
router.patch("/:id", updateCurrency);



/**
 * DELETE /:id
 * -------------
 * Elimina una moneda existente por su ID.
 * 
 * @swagger
 * /api/currencies/{id}:
 *   delete:
 *     summary: Eliminar una moneda por ID
 *     tags: [Currencies]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la moneda a eliminar
 *     responses:
 *       200:
 *         description: Moneda eliminada exitosamente.
 *       404:
 *         description: Moneda no encontrada.
 */
router.delete("/:id", deleteCurrency);



/**
 * POST /restore/:id
 * -----------------
 * Restaura una moneda eliminada previamente por su ID. 
 * 
 * @swagger
 * /api/currencies/restore/{id}:
 *   post:
 *     summary: Restaurar una moneda eliminada por ID
 *     tags: [Currencies]   
 *     parameters:       
 *       - in: path  
 *         name: id
 *         required: true
 *         schema:   
 *           type: string 
 *         description: ID de la moneda a restaurar
 *     responses:
 *       200:
 *         description: Moneda restaurada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               message: "Moneda restaurada correctamente."
 *               id: "USD"
 *       404:
 *         description: Moneda no encontrada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *             example:
 *               error: "Moneda no encontrada."
 */
router.post("/restore/:id", restoreCurrency);

export default router;