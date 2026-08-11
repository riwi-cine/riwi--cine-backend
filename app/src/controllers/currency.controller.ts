import {Request, Response} from 'express';
import currencyService from '../services/currency.service';
import {CreateCurrencyDto} from '../dto/create-currency.dto';

/**
 * Controlador para manejar las operaciones relacionadas con las monedas.
 *
 * Este controlador actúa como intermediario entre las solicitudes HTTP y la capa de servicios,
 * delegando la lógica de negocio al `currencyService`.
 * 
 * Responsabilidades:
 *  - Recibir y procesar las solicitudes HTTP.
 *  - Obtener la información enviada por el cliente.
 *  - Invocar el servicio correspondiente.
 *  - Construir la respuesta HTTP.
 *  - Retornar los códigos de estado apropiados.
 */

/**
 * Crea una nueva moneda.
 *
 * Recibe la información enviada por el cliente, construye el DTO de creación
 * y delega la operación al servicio correspondiente.
 * 
 * @async
 * @param {Request} req - Objeto de la petición HTTP.
 *
 * Espera recibir en el body:
 * @example
 *  {
 *    "code": "USD",
 *    "name": "Dólar estadounidense",
 *    "symbol": "$"
 *  }
 * 
 * @param {Response} res - Objeto de la respuesta HTTP.
 * 
 * @returns {Promise<void>} - Retorna una promesa que resuelve la respuesta HTTP.
 * 
 *  **201 Created**: Si la moneda se crea exitosamente, retorna un objeto JSON con la información de la moneda creada.
 * 
 * **400 Bad Request**: Si los datos enviados por el cliente son inválidos o incompletos, retorna un mensaje de error.
 * 
 * @throws {Error} - Lanza un error si ocurre algún problema durante la creación de la moneda.
 */
export const createCurrency = async (req: Request, res: Response): Promise<void> => {
    try {
        const createCurrencyDto: CreateCurrencyDto = req.body;

        const newCurrency = await currencyService.create(createCurrencyDto);
        res.status(201).json(newCurrency);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
}

/**
 * Obtiene todas las monedas registradas.
 *
 * @async
 * @param {Response} res - Objeto de la respuesta HTTP.
 * 
 * @returns {Promise<void>} - Retorna una promesa que resuelve la respuesta HTTP.
 * 
 * **200 OK**: Si la operación es exitosa, retorna un array JSON con todas las monedas registradas.
 * 
 * **500 Internal Server Error**: Si ocurre algún problema durante la obtención de las monedas, retorna un mensaje de error.
 */
export const getCurrencies = async (_req: Request, res: Response): Promise<void> => {
    try {
        const currencies = await currencyService.findAll();
        res.status(200).json(currencies);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message });
    }
}

/**
 * Actualiza una moneda existente.
 *
 * @async
 * @param {Request} req - Objeto de la petición HTTP.
 * @param {Response} res - Objeto de la respuesta HTTP.
 * 
 * @returns {Promise<void>} - Retorna una promesa que resuelve la respuesta HTTP.
 * 
 * **200 OK**: Si la moneda se actualiza exitosamente, retorna un objeto JSON con la información de la moneda actualizada.
 * 
 * **404 Not Found**: Si la moneda no se encuentra, retorna un mensaje de error.
 * 
 * **400 Bad Request**: Si los datos enviados por el cliente son inválidos o incompletos, retorna un mensaje de error.
 */
export const updateCurrency = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const updateCurrencyDto: Partial<CreateCurrencyDto> = req.body;

        const updatedCurrency = await currencyService.update(parseInt(id), updateCurrencyDto);
        res.status(200).json(updatedCurrency);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
}

/**
 * Elimina una moneda existente.    
 * 
 * @async
 * @param {Request} req - Objeto de la petición HTTP.
 * @param {Response} res - Objeto de la respuesta HTTP.
 * 
 * @returns {Promise<void>} - Retorna una promesa que resuelve la respuesta HTTP.
 * 
 * **200 OK**: Si la moneda se elimina exitosamente, retorna un mensaje de confirmación.
 * 
 * **404 Not Found**: Si la moneda no se encuentra, retorna un mensaje de error.
 * 
 * **400 Bad Request**: Si los datos enviados por el cliente son inválidos o incompletos, retorna un mensaje de error.
 */
export const deleteCurrency = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await currencyService.delete(parseInt(id));
        res.status(200).json({ message: "Moneda eliminada correctamente." });
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
}


/** 
 * Restaura una moneda previamente eliminada.
 * 
 * @async
 * @param {Request} req - Objeto de la petición HTTP.
 * @param {Response} res - Objeto de la respuesta HTTP.
 * 
 * @returns {Promise<void>} - Retorna una promesa que resuelve la respuesta HTTP.
 * 
 * **200 OK**: Si la moneda se restaura exitosamente, retorna un mensaje de confirmación.
 * 
 * **404 Not Found**: Si la moneda no se encuentra, retorna un mensaje de error.
 * 
 * **400 Bad Request**: Si los datos enviados por el cliente son inválidos o incompletos, retorna un mensaje de error.
 */
export const restoreCurrency = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        await currencyService.restore(parseInt(id));
        res.status(200).json({ message: "Moneda restaurada correctamente." });
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
}

