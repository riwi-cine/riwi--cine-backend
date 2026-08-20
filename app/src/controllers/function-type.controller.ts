import {Request, Response} from "express";
import functionTypeService from "../services/function-type.service";
import { CreateFunctionTypeDto } from "../dto/function-type.dto";


export const createFunctionType = async (req: Request, res: Response): Promise<void> => {
    try {
        const createFunctionType: CreateFunctionTypeDto = req.body;

        const newFunctionType = await functionTypeService.create(createFunctionType);
        res.status(201).json(newFunctionType);
    } catch (error) {
        res.status(400).json({ message: (error as Error).message });
    }
}

