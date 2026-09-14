import FunctionType, {FunctionTypeCreationAttributes} from "../../models/function-type.model"

/**
 * Contrato del Repositorio de tipo de función (2D, 3D, 4D)
 * --------------------------------------------------------
 * Define las operaciones de persistencia disponibles para la entidad FunctionType
 * 
 * Cualquier implementación debera cumplir esta interfaz.
 */
export interface IfunctionTypeRespository {

    /**
     * Permite crear una nueva entidad FunctionType
     * 
     * @param {FunctionTypeCreationAttributes} data 
     */
    create(data: FunctionTypeCreationAttributes): Promise<FunctionType>;

    /**
     * Obtener todas las entidades FunctionType
     */
    findAll(): Promise<FunctionType[]>;

    /**
     * Devuelve una entidad tipo de FunctionType en el ID
     * @param {number} id 
     */
    findOne(id: number): Promise<FunctionType>;

    /**
     * Recibe el parametro ID para localizar la entidad FunctionType, y luego usa la data para actualizarla.
     * @param {number} id 
     * @param {Partial<FunctionTypeCreationAttributes>} data 
     */
    update(id: number, data: Partial<FunctionTypeCreationAttributes>): Promise<FunctionType | null>;

    /**
     * Elimina una FunctionType basado en el ID
     * @param {number} id  
     */
    delete(id: number): Promise<Boolean>;

    /**
     * Restaura una entidad eliminada de FunctionType
     * @param {number} id 
     */
    restore(id: number): Promise<void>;
}