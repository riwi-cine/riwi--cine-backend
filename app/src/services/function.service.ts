import Function, {FunctionDetail} from "../models/function.model";
import repository from "../repositories/function.repository";
import { IFunctionService } from "./interfaces/function.service.interface";
import { CreateFunctionDto } from "../dto/create-function.dto";
import movieRepository from "../repositories/movie.repository";

/**
 * Servicio de Funciones de cine
 * -----------------------------
 * Contiene la lógica de negocio relacionada con las funciones de cine, así como las proximás funciones.
 */
class FunctionService implements IFunctionService {
    
    async create(data: CreateFunctionDto): Promise<Function> {
        return await repository.create(data);
    };

    async findAll(): Promise<Function[]>{
        return await repository.findAll();
    };

    async findOne(id: number): Promise<FunctionDetail | null> {
        return await repository.findOne(id);
    };

    /**
     * Obtiene las funciones futuras de una película.
     *
     * Aplica RN-014: solo funciones futuras.
     * Aplica RN-015: devuelve información suficiente para identificar funciones agotadas.
     */
    async findFutureFunctions(
        movieId: number,
        cityId?: number,
    ): Promise<FunctionDetail[]> {
        const movie = await movieRepository.findDetailById(movieId);
        if (!movie) {
            throw new Error("Película no encontrada.");
        }

        const functions = await repository.findFutureFunctions(movieId, cityId);

        return functions.map((func) => ({
            ...func,
            isSoldOut: func.room && func.room.capacity !== undefined
                ? func.ticketsCount >= func.room.capacity
                : false,
        }));
    }

    async update(id: number, data: CreateFunctionDto): Promise<Function | null> {
        const cineFunction = await repository.findOne(id);
        if (!cineFunction) {
            throw new Error("Funcion de cine no encontrada");
        }
        return await repository.update(id, data)
    }

    async delete(id: number): Promise<boolean>{
        const cineFUnction = await repository.findOne(id);
        if(!cineFUnction) {
            throw new Error("Función de cine no encontrada")
        }
        return await repository.delete(id);
    };

    async restore(id: number): Promise<void> {
        const cineFunction = await repository.findOne(id);
        if (!cineFunction) {
            throw new Error("Función de cine no encontrada");
        }
        await repository.restore(id);
    };
};

export default new FunctionService();