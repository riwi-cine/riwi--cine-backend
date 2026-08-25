import Function, {FunctionDetail, FunctionCreationAttributes} from "../../models/function.model";

/**
 * Contrato del Servicio de Funciones
 * ----------------------------------
 * Define la lógica de negocio aplicable al módulo de funciones de cine.
 */
export interface IFunctionService {

    create(data: FunctionCreationAttributes): Promise<Function>;

    findAll(): Promise<Function[]>;

    findOne(id: number): Promise<FunctionDetail | null>;

    findFutureFunctions(movieId: number, cityId?: number): Promise<FunctionDetail[]>;

    update(id: number, data: Partial<FunctionCreationAttributes>): Promise<Function | null>;

    delete(id: number): Promise<boolean>;

    restore(id:number): Promise<void>;
}