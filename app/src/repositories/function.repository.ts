import Function, {FunctionCreationAttributes, FunctionDetail} from "../models/function.model";
import { IfunctionRepository } from "./interfaces/function.repository.interface";

/**
 * Repository de entidad Function
 * ------------------------------
 * Implementa el patrón Repository para encapsular todas las operaciones
 * de persistencia relacionadas con la entidad Function.
 * 
 * Esta clase es la única responsable de interactuar con Sequelize.
 */
class FunctionRepository implements IfunctionRepository {

    /**
     * 
     * @param {FunctionCreationAttributes} data 
     * @returns {Promise<Function>}
     */
    async create(data: FunctionCreationAttributes): Promise<Function> {
        return await Function.create(data);
    }

    async findAll(): Promise<Function[]> {
        return await Function.findAll();
    }

    async findOne(): Promise<FunctionDetail> {
        return await Function.findOne();
    }

    async update(id: number, data: FunctionCreationAttributes): Promise<FunctionDetail | null> {
        const cineFunction = await Function.findOne({where: {id}});
        if (cineFunction){
            return await cineFunction.update(data);
        }
        return null
    }

    async delete(id: number): Promise<boolean> {
        const row = await Function.destroy({where: {id}});
        return row > 0;
    }

        async restore(id: number): Promise<void> {
        const cineFunction = await Function.findOne({ where: { id }, paranoid: false });
        if (cineFunction) {
            await cineFunction.restore();
        } else {
            throw new Error("Función no encontrada");
        }
    }  
}