// app/src/service/function-type.service.ts

import FunctionType from "../models/function-type.model";
import { CreateFunctionTypeDto } from "../dto/function-type.dto";
import repository from "../repositories/function-type.repository";
import { IfunctionTypeRespository } from "../repositories/interfaces/function-type.repository.interface";

/**
 * Servicio de FunctionType
 * ------------------------
 * Contiene toda la lógica de negocio relacionada con la entidad FunctionType.
 * 
 * Responsabilidades:
 *  - Validar reglas de negocio.
 *  - Coordinar operaciones entre one o varios repositorios.
 *  - Orquestar procesos antes y después de persistir información.
 *  - Mantener al controlador libre de lógica de negocio.
 * 
 * Ejemplo de reglas de negocio:
 * 
 *  Verifica que el código de FunctionType no exista antes de crear la entidad.
 *  
 * El servicio conoce las reglas de negocio.
 * El Repository únicamente conoce cómo guardar y consultar información.
 */

class FunctionTypeService implements IfunctionTypeRespository {
        async create(dto: CreateFunctionTypeDto): Promise<FunctionType> {   

        return await repository.create(dto);
    }

    /**
     * Obtiene todas las monedas.
     */
    async findAll(): Promise<FunctionType[]> {
        return await repository.findAll();
    }

    /**
     * Obtiene una moneda por su código.
     */
    async findOne(id: number): Promise<FunctionType> {
        return await repository.findOne(id);
    }

    async update(id: number, dto: Partial<CreateFunctionTypeDto>): Promise<FunctionType | null> {
        const currency = await repository.findOne(id);
        if (!currency) {
            throw new Error("Función no encontrada");
        }
        return await repository.update(id, dto);
    }

    async delete(id:number): Promise<Boolean> {
        const currency = await repository.findOne(id);
        if (!currency) {
            throw new Error("Función no encontrada");
        }
        return await repository.delete(id);
    }

    async restore(id: number): Promise<void> {
        const currency = await repository.findOne(id);
        if (!currency) {
            throw new Error("Función no encontrada");
        }
        await repository.restore(id);
    }
}

export default new FunctionTypeService();