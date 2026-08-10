// app /src/routes/currency.routes.ts

/**
 * Rutas de Moneda
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