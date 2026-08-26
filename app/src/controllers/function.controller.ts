import { Request, Response } from "express";
import functionService from "../services/function.service";

/**
 * Esta función permite localizar las funciones futuras o venideras.
 * @param req 
 * @param res 
 * @returns 
 */
export const getUpcomingFunctions = async (req: Request, res: Response): Promise<Response> => {
    try {
        const movieId = Number(req.params.id);

        if (Number.isNaN(movieId) || movieId <= 0) {
            return res.status(400).json({ error: "El id de la película debe ser un número válido." });
        }

        const cityIdParam = req.query.cityId;
        let cityId: number | undefined;

        if (cityIdParam !== undefined) {
            cityId = Number(cityIdParam);
            if (Number.isNaN(cityId) || cityId <= 0) {
                return res.status(400).json({ error: "El id de la ciudad debe ser un número válido." });
            }
        }

        const functions = await functionService.findFutureFunctions(movieId, cityId);

        return res.status(200).json(functions);
    } catch (error: any) {
        if (error.message === "Película no encontrada.") {
            return res.status(404).json({ error: error.message });
        }
        return res.status(500).json({ error: error.message });
    }
};

/**
 * Obtiene el detalle de una función específica.
 *
 * La función debe existir y estar activa para poder
 * ser seleccionada por el usuario.
 *
 * @param req
 * @param res
 * @returns
 */
export const getFunctionById = async (req: Request, res: Response): Promise<Response> => {
    try {
        const functionId = Number(req.params.id);

        if (Number.isNaN(functionId) || functionId <= 0) {
            return res.status(400).json({
                error: "El id de la función debe ser un número válido."
            });
        }

        const cineFunction = await functionService.findOne(functionId);

        if (!cineFunction) {
            return res.status(404).json({
                error: "Función no encontrada."
            });
        }

        return res.status(200).json(cineFunction);

    } catch (error: any) {
        return res.status(500).json({
            error: error.message
        });
    }
};

/**
 * Obtiene el precio final de una función.
 *
 * @param req
 * @param res
 * @returns
 */
export const getFunctionFinalPrice = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const functionId = Number(req.params.id);

        if (Number.isNaN(functionId) || functionId <= 0) {
            return res.status(400).json({
                error: "El id de la función debe ser un número válido."
            });
        }

        const price = await functionService.getPrice(functionId);

        if (!price) {
            return res.status(404).json({
                error: "Función no encontrada."
            });
        }

        return res.status(200).json(price);

    } catch (error: any) {
        return res.status(500).json({
            error: error.message
        });
    }
};

/**
 * Crea una nueva función de cine.
 *
 * @param req
 * @param res
 * @returns
 */
export const createFunction = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const cineFunction = await functionService.create(req.body);

        return res.status(201).json(cineFunction);

    } catch (error: any) {
        return res.status(500).json({
            error: error.message
        });
    }
};

/**
 * Actualiza una función de cine.
 *
 * @param req
 * @param res
 * @returns
 */
export const updateFunction = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const functionId = Number(req.params.id);

        if (Number.isNaN(functionId) || functionId <= 0) {
            return res.status(400).json({
                error: "El id de la función debe ser un número válido."
            });
        }

        const cineFunction = await functionService.update(
            functionId,
            req.body
        );

        if (!cineFunction) {
            return res.status(404).json({
                error: "Función de cine no encontrada."
            });
        }

        return res.status(200).json(cineFunction);

    } catch (error: any) {
        return res.status(500).json({
            error: error.message
        });
    }
};

/**
 * Elimina una función de cine mediante soft-delete.
 *
 * @param req
 * @param res
 * @returns
 */
export const deleteFunction = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const functionId = Number(req.params.id);

        if (Number.isNaN(functionId) || functionId <= 0) {
            return res.status(400).json({
                error: "El id de la función debe ser un número válido."
            });
        }

        const deleted = await functionService.delete(functionId);

        if (!deleted) {
            return res.status(404).json({
                error: "Función de cine no encontrada."
            });
        }

        return res.status(200).json({
            message: "Función de cine eliminada correctamente."
        });

    } catch (error: any) {
        return res.status(500).json({
            error: error.message
        });
    }
};

/**
 * Restaura una función de cine eliminada mediante soft-delete.
 *
 * @param req
 * @param res
 * @returns
 */
export const restoreFunction = async (
    req: Request,
    res: Response
): Promise<Response> => {
    try {
        const functionId = Number(req.params.id);

        if (Number.isNaN(functionId) || functionId <= 0) {
            return res.status(400).json({
                error: "El id de la función debe ser un número válido."
            });
        }

        await functionService.restore(functionId);

        return res.status(200).json({
            message: "Función de cine restaurada correctamente."
        });

    } catch (error: any) {
        if (error.message === "Función de cine no encontrada") {
            return res.status(404).json({
                error: error.message
            });
        }

        return res.status(500).json({
            error: error.message
        });
    }
};