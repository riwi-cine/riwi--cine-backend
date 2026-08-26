import {Request, Response} from "express";
import functionTypeService from "../services/function-type.service";
import { CreateFunctionTypeDto } from "../dto/create-function-type.dto";
import FunctionType from "../models/function-type.model";

/**
 * Crea un nuevo FunctionType.
 * 
 * Recibe la información enviada por el cliente, construye el DTO de creación
 * y deleg la operación al servicio correspondiente.
 * 
 * @param {Request} req - Objeto de petición HTTP.
 * 
 * @param {Response} res - Objeto de respuesta HTTP.
 */
export const createFunctionType = async (req: Request, res: Response): Promise<FunctionType | void> => {
    try {
        const createFunctionType: CreateFunctionTypeDto = req.body;

        const newFunctionType = await functionTypeService.create(createFunctionType);
        res.status(201).json(newFunctionType);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
}

/**
 * Esta es la función para obtener la lista de todas las functionTypes
 * La functionType es el tipo de función que se va a presentar.
 * Ejemplo: 
 *  - D2 doblada español latino.
 * 
 * @param _req - El guion bajo significa que el Request no se va a solicitar
 * @param res - Esta es la Respuesta a la petición que se hizo mediante el método findAll()
 */
export const getFunctionTypes = async (_req: Request, res: Response): Promise <FunctionType[] | void> => {
    try {
        const functionTypes = await FunctionType.findAll();
        res.status(200).json(functionTypes);
    } catch (error) {
        res.status(500).json({ message: (error as Error).message});
    }
}

/**
 * Actualiza la información de un tipo de función (functionType)
 * 
 * @param {id, updateFunctionType} req - Recibe el id para validar la cuenta y recibe el parámetro updateFunctionType el cual es un body request que permite actualizar la información de la cuenta validada por el id. 
 * @param {updateFunctionType} res - En este case el Response es el tipo de función ya actualizado.
 */
export const updateFunctionType = async (req: Request, res: Response): Promise <FunctionType | void> => {
    try {
        const {id} = req.params;
        const updateFunctionTypeDto: Partial<CreateFunctionTypeDto> = req.body;

        const updateFunctionType = await functionTypeService.update(parseInt(id), updateFunctionTypeDto);
        res.status(200).json(updateFunctionType);
    } catch(error) {
        res.status(400).json({ message: (error as Error).message});
    }
}

/**
 * Elimina un tipo de función.
 * 
 * @param {id} req -el Request es el id, identidicador único. 
 * @param res -Si el identificador único es encontrado, entonces elimina el tipo de función con un soft-delete.
 * Cuando un elemento se elimina con soft-delete, este elemento puede llegar a restaurarse despues.
 */
export const deleteFunctionType = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id} = req.params;

        await functionTypeService.delete(parseInt(id));
        res.status(200).json({message: "El tipo de función finalizó o ya no esta disponible"});
    } catch(error) {
        res.status(400).json({message: (error as Error). message});
    }
}

/**
 * Restaura un tipo de función eliminado previamente.
 * 
 * @param {id} req -el Request es el id, identidicador único.
 * @param {functionType} res - Devuelve el tipo de función restaurado.
 */
export const restoreFunctionType = async(req: Request, res: Response): Promise<FunctionType | void> => {
    try {
        const {id} = req.params;

        const functionType = await functionTypeService.restore(parseInt(id));
        res.status(200).json({message: "tipo de función restaurada", functionTypeResored: functionType});
    } catch(error){
        res.status(400).json({ message: (error as Error).message});
    }
}