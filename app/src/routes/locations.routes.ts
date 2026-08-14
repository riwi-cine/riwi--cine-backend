// app/src/routes/country.routes.ts

/**
 * Rutas de Ubicaciones (Locations)
 *
 * ---
 * Este archivo define las rutas HTTP relacionadas con ubicaciones (`Country`, `Department`, `City`).
 *
 * Endpoints disponibles:
 *
 * - `POST /countries/`            : Crear un nuevo país.
 * - `GET /countries/`             : Obtener todos los países registrados.
 * - `GET /departments/:countryId` : Obtener departamentos activos por país.
 * - `GET /cities/:departmentId`   : Obtener ciudades activas por departamento.
 * - `GET /countries/:name`        : Obtener un país específico por nombre.
 *
 * Cada ruta se conecta con su respectivo controlador.
 */

import { Router } from "express";
import {
    createCountry,
    getAllCountries,
    getCities,
    getCountryById,
    getDepartments,
} from "../controllers/locations.controller";

const router = Router();

/**
 * Crea un nuevo país en la base de datos.
 *
 * @swagger
 * /api/countries:
 *   post:
 *     summary: Crear un nuevo país
 *     tags: [Locations]
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
 *                 example: "COP"
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
 *               error: "La moneda \"COP\" no existe."
 */
router.post("/countries", createCountry);

/**
 * Obtiene todos los países registrados en la base de datos.
 *
 * @swagger
 * /api/countries:
 *   get:
 *     summary: Obtener todos los países
 *     tags: [Locations]
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
router.get("/countries", getAllCountries);

/**
 * @swagger
 * /api/departments/{countryId}:
 *   get:
 *     summary: Obtener departamentos activos por país
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: countryId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del país.
 *     responses:
 *       200:
 *         description: Lista de departamentos obtenida exitosamente.
 *       400:
 *         description: ID de país inválido.
 */
router.get("/departments/:countryId", getDepartments);

/**
 * @swagger
 * /api/cities/{departmentId}:
 *   get:
 *     summary: Obtener ciudades activas por departamento
 *     description: RN-006 - Solo retorna ciudades activas que tienen al menos un cine activo.
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: departmentId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del departamento.
 *     responses:
 *       200:
 *         description: Lista de ciudades con cines activos obtenida exitosamente.
 *       400:
 *         description: ID de departamento inválido.
 */
router.get("/cities/:departmentId", getCities);

/**
 * Obtiene un país específico por su nombre.
 *
 * @swagger
 * /api/countries/{id}:
 *   get:
 *     summary: Obtener un país por ID
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del país a buscar.
 *         example: 1
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
 *         description: El ID del país es obligatorio.
 *         content:
 *           application/json:
 *             example:
 *               error: "El ID del país es obligatorio."    
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
router.get("/countries/:id", getCountryById);

export default router;
