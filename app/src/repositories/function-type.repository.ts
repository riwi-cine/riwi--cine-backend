import FunctionType, {FunctionTypeCreationAttributes} from "../models/function-type.model";
import { IfunctionTypeRespository } from "./interfaces/function-type.repository.interface";

/**
 * Repository de FunctionType
 * --------------------------
 * Implementa el patrón Repository para encapsular todas las operaciones de persistencia relacionadas con la entidad FunctionType.
 * 
 * Esta clase es la única responsable de interactuar con Sequelize.
 */

class FunctionTypeRepository implements IfunctionTypeRespository {

    /**
     * Permite crear una nueva entidad FunctionType
     * 
     * @param {FunctionTypeCreationAttributes} data 
     */
    async create(data: FunctionTypeCreationAttributes): Promise<FunctionType> {
        return await FunctionType.create(data);
    };

    /**
     * Obtener todas las entidades FunctionType
     */
    async findAll(): Promise<FunctionType[]> {
        return await FunctionType.findAll();
    };

    /**
     * Devuelve una entidad tipo de FunctionType en el ID
     * @param {number} id 
     */
    async findOne(id: number): Promise<FunctionType> {
        const functionType = await FunctionType.findOne({ where: { id } });
        if (!functionType) {
            throw new Error("Función no disponible");
        }
        return functionType;
    };

    /**
     * Recibe el parametro ID para localizar la entidad FunctionType, y luego usa la data para actualizarla.
     * @param {number} id 
     * @param {Partial<FunctionTypeCreationAttributes>} data 
     */
    async update(id: number, data: Partial<FunctionTypeCreationAttributes>): Promise<FunctionType | null> {
        const functionType = await FunctionType.findOne({ where: { id } });
        if (functionType) {
            return await functionType.update(data);
        }
        return null;
    };

        /**
     * Elimina una FunctionType basado en el ID
     * @param {number} id  
     */
    async delete(id: number): Promise<Boolean> {
        const row = await FunctionType.destroy({ where: {id}});
        return row > 0;
    };

    /**
     * Restaura una entidad eliminada de FunctionType
     * @param {number} id 
     */
    async restore(id: number): Promise<void> {
        const functionType = await FunctionType.findOne({ where: { id }, paranoid: false });

        if (!functionType) {
            throw new Error("Tipo de función no encontrado");
        }
        await functionType.restore();
        await functionType.reload();
        return functionType;
    }
}

export default new FunctionTypeRepository();