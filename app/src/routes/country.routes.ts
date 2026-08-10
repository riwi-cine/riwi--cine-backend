
// app/src/routes/country.routes.ts

/**
 * Rutas de Países
 *
 * ---
 * Este archivo define las rutas HTTP relacionadas con la entidad `Country`.
 *
 * Endpoints disponibles:
 *
 * - `POST /countries/`       : Crear un nuevo país.
 * - `GET /countries/`        : Obtener todos los países registrados.
 * - `GET /countries/:name`   : Obtener un país específico por nombre.
 *
 * Cada ruta se conecta con su respectivo controlador.
 */

import { Router } from "express";
import {
  createCountry,
  getAllCountries,
  getCountryByName,
} from "../controllers/country.controller";

const router = Router();

/**
 * Crea un nuevo país en la base de datos.
 *
 * @swagger
 * /api/countries:
 *   post:
 *     summary: Crear un nuevo país
 *     tags: [Countries]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currencyCode
 *               - name
 *               - code
 *             properties:
 *               currencyCode:
 *                 type: string
 *                 example: "USD"
 *                 description: Código de la moneda asociada al país.
 *               name:
 *                 type: string
 *                 example: "Colombia"
 *                 description: Nombre del país.
 *               code:
 *                 type: string
 *                 example: "CO"
 *                 description: Código del país.
 *     responses:
 *       201:
 *         description: País creado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               currencyId: 1
 *               name: "Colombia"
 *               code: "CO"
 *               active: true
 *       400:
 *         description: Datos inválidos, incompletos o moneda no encontrada.
 *         content:
 *           application/json:
 *             example:
 *               error: "La moneda \"USD\" no existe."
 */
router.post("/", createCountry);

/**
 * Obtiene todos los países registrados en la base de datos.
 *
 * @swagger
 * /api/countries:
 *   get:
 *     summary: Obtener todos los países
 *     tags: [Countries]
 *     responses:
 *       200:
 *         description: Lista de países obtenida exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Country'
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: "Error al obtener los países."
 */
router.get("/", getAllCountries);

/**
 * Obtiene un país específico por su nombre.
 *
 * @swagger
 * /api/countries/{name}:
 *   get:
 *     summary: Obtener un país por nombre
 *     tags: [Countries]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: Nombre del país a buscar.
 *         example: "Colombia"
 *     responses:
 *       200:
 *         description: País encontrado exitosamente.
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               currencyId: 1
 *               name: "Colombia"
 *               code: "CO"
 *               active: true
 *       400:
 *         description: El nombre del país es obligatorio.
 *         content:
 *           application/json:
 *             example:
 *               error: "El nombre del país es obligatorio."
 *       404:
 *         description: País no encontrado.
 *         content:
 *           application/json:
 *             example:
 *               error: "País no encontrado."
 *       500:
 *         description: Error interno del servidor.
 *         content:
 *           application/json:
 *             example:
 *               error: "Error interno del servidor."
 */
router.get("/:name", getCountryByName);

export default router;

