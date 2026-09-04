import { Request, Response } from "express";
import seatService from "../services/seat.service";

/**
 * Controlador de la HU-010 — Selección Interactiva de Sillas
 * --------------------------------------------------------
 * Traduce las peticiones HTTP en llamadas al `SeatService` y mapea los
 * errores de negocio a códigos de estado.
 */

/** Traduce el mensaje de un error de negocio al código de estado adecuado. */
const statusFromError = (message: string): number => {
    if (message.includes("no encontrada")) {
        return 404;
    }
    if (message.includes("no está disponible") || message.includes("compras simultáneas")) {
        return 409;
    }
    return 400;
};

/** Valida que un valor sea un entero positivo. */
const isPositiveInt = (value: unknown): value is number =>
    typeof value === "number" && Number.isInteger(value) && value > 0;

/**
 * GET /api/functions/:id/seats
 * Devuelve el mapa de la sala de una función con el estado de cada silla.
 */
export const getFunctionSeatMap = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    try {
        const functionId = Number(req.params.id);
        if (Number.isNaN(functionId) || functionId <= 0) {
            return res.status(400).json({
                error: "El id de la función debe ser un número válido.",
            });
        }

        let cartId: number | undefined;
        if (req.query.cartId !== undefined) {
            cartId = Number(req.query.cartId);
            if (Number.isNaN(cartId) || cartId <= 0) {
                return res.status(400).json({
                    error: "El id del carrito debe ser un número válido.",
                });
            }
        }

        const seatMap = await seatService.getSeatMap(functionId, cartId);
        return res.status(200).json(seatMap);
    } catch (error: any) {
        const message = error.message ?? "Error interno del servidor.";
        return res.status(statusFromError(message)).json({ error: message });
    }
};

/**
 * POST /api/reservations/lock-seats
 * Bloquea temporalmente las sillas seleccionadas por un carrito (RN-039).
 */
export const lockSeats = async (req: Request, res: Response): Promise<Response> => {
    try {
        const functionId = Number(req.body.functionId);
        const cartId = Number(req.body.cartId);
        const seatIds = req.body.seatIds;

        if (!isPositiveInt(functionId)) {
            return res.status(400).json({ error: "functionId debe ser un número válido." });
        }
        if (!isPositiveInt(cartId)) {
            return res.status(400).json({ error: "cartId debe ser un número válido." });
        }
        if (!Array.isArray(seatIds) || seatIds.length === 0 || !seatIds.every(isPositiveInt)) {
            return res.status(400).json({
                error: "seatIds debe ser un arreglo no vacío de identificadores válidos.",
            });
        }

        const result = await seatService.lockSeats({ functionId, cartId, seatIds });

        // Ninguna silla pudo bloquearse: conflicto de disponibilidad.
        if (result.lockedSeatIds.length === 0) {
            return res.status(409).json(result);
        }

        return res.status(200).json(result);
    } catch (error: any) {
        const message = error.message ?? "Error interno del servidor.";
        return res.status(statusFromError(message)).json({ error: message });
    }
};

/**
 * DELETE /api/reservations/release-seats
 * Libera las sillas bloqueadas por un carrito (RN-040).
 */
export const releaseSeats = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    try {
        const functionId = Number(req.body.functionId);
        const cartId = Number(req.body.cartId);
        const rawSeatIds = req.body.seatIds;

        if (!isPositiveInt(functionId)) {
            return res.status(400).json({ error: "functionId debe ser un número válido." });
        }
        if (!isPositiveInt(cartId)) {
            return res.status(400).json({ error: "cartId debe ser un número válido." });
        }

        let seatIds: number[] | undefined;
        if (rawSeatIds !== undefined) {
            if (!Array.isArray(rawSeatIds) || !rawSeatIds.every(isPositiveInt)) {
                return res.status(400).json({
                    error: "seatIds debe ser un arreglo de identificadores válidos.",
                });
            }
            seatIds = rawSeatIds;
        }

        const result = await seatService.releaseSeats({ functionId, cartId, seatIds });
        return res.status(200).json(result);
    } catch (error: any) {
        const message = error.message ?? "Error interno del servidor.";
        return res.status(statusFromError(message)).json({ error: message });
    }
};

/**
 * GET /api/reservations/summary?functionId=&cartId=
 * Devuelve el resumen económico de las sillas bloqueadas por un carrito.
 */
export const getReservationSummary = async (
    req: Request,
    res: Response,
): Promise<Response> => {
    try {
        const functionId = Number(req.query.functionId);
        const cartId = Number(req.query.cartId);

        if (!isPositiveInt(functionId)) {
            return res.status(400).json({ error: "functionId debe ser un número válido." });
        }
        if (!isPositiveInt(cartId)) {
            return res.status(400).json({ error: "cartId debe ser un número válido." });
        }

        const summary = await seatService.getReservationSummary(functionId, cartId);
        return res.status(200).json(summary);
    } catch (error: any) {
        const message = error.message ?? "Error interno del servidor.";
        return res.status(statusFromError(message)).json({ error: message });
    }
};
