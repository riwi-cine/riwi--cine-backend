import Function, {FunctionCreationAttributes, FunctionDetail, FunctionPriceDetail} from "../../models/function.model";

/**
 * Contrato de Repository de las funciones a presentar en los cines
 * ----------------------------------------------------------------
 * Define las operaciones de persistencia disponibles para la entidad Function
 * 
 * Cualquier implementación debera cumplir esta interfaz.
 */
export interface IfunctionRepository {

    /**
     * 
     * @param {FunctionCreationAttributes} data 
     */
    create(data: FunctionCreationAttributes): Promise<Function>; 

    /**
     * Obtener todas las entidades de tipo Function.
     */
    findAll(): Promise<Function[]>;

    /**
     * Devuelve una función pero con todos los detalles.
     * @param {number} id 
     */
    findOne(id: number): Promise<FunctionDetail | null>;

    /**
     * 
     * @param {number} movieId -ID de la entidad movie asociada
     * @param {number} cityId -ID de la entidad city asociada
     */
    findFutureFunctions(movieId: number, cityId?: number): Promise<FunctionDetail[]>;

    /**
     * Obtiene el precio de una función.
     * @param {number} id - ID de la función.
     */
    getPrices(id: number): Promise<FunctionPriceDetail | null>;
    
    /**
     * Recibe el parámetro ID para localizar una entidad y luego actualizarla utilizando los parammetros de la función.
     * @param {number} id 
     * @param {FunctionCreationAttributes} data 
     */
    update(id: number, data: FunctionCreationAttributes): Promise<Function | null>;

    /**
     * Localiza una entidad usando el ID y luego la elimina con un soft-delete.
     * @param {number} id 
     */
    delete(id: number): Promise<boolean>;

    /**
     * Localiza una entidad eliminada con el soft-delete para luego restaurarla.
     * @param {number} id 
     */
    restore(id: number): Promise<void>;
}

