// app/src/services/currency.service.ts

import Currency from "../models/currency.model";
import { CreateCurrencyDto } from "../dto/create-currency.dto";
import repository from "../repositories/currency.repository";
import { ICurrencyService } from "./interfaces/currency.service.interface";

/**
 * Servicio de Monedas
 * --------------------
 * Contiene toda la lógica de negocio relacionada con la entidad Currency.
 *
 * Responsabilidades:
 *  - Validar reglas de negocio.
 *  - Coordinar operaciones entre uno o varios repositorios.
 *  - Orquestar procesos antes y después de persistir información.
 *  - Mantener al controlador libre de lógica de negocio.
 *
 * Ejemplos de reglas de negocio:
 *
 *  Verificar que el código de moneda no exista antes de crear la moneda.
 *  Validar que el símbolo de la moneda sea único.
 *
 * El Service conoce las reglas del negocio.
 * El Repository únicamente conoce cómo guardar y consultar información.    
 */

class CurrencyService implements ICurrencyService { 
    async create(dto: CreateCurrencyDto): Promise<Currency> {   
        /**
         * Ejemplo de regla de negocio:
         *
         * Antes de crear una moneda podríamos validar que el código
         * de moneda no se encuentre registrado.    
         * 
         * const existingCurrency = await repository.findOne(dto.code);
         *
         * if (existingCurrency) {
         *     throw new Error("El código de moneda ya se encuentra registrado.");
         * }
         *
         * También podríamos:
         *  - Validar que el símbolo de la moneda sea único.
         *  - Registrar la operación en una bitácora.
         */

        return await repository.create(dto);
    }

    /**
     * Obtiene todas las monedas.
     */
    async findAll(): Promise<Currency[]> {
        return await repository.findAll();
    }

    /**
     * Obtiene una moneda por su código.
     */
    async findOne(id: number): Promise<Currency | null> {
        return await repository.findOne(id);
    }

    async update(id: number, dto: Partial<CreateCurrencyDto>): Promise<Currency | null> {
        const currency = await repository.findOne(id);
        if (!currency) {
            throw new Error("Moneda no encontrada");
        }
        return await repository.update(id, dto);
    }

    async delete(id:number): Promise<Boolean> {
        const currency = await repository.findOne(id);
        if (!currency) {
            throw new Error("Moneda no encontrada");
        }
        return await repository.delete(id);
    }

    async restore(id: number): Promise<void> {
        const currency = await repository.findOne(id);
        if (!currency) {
            throw new Error("Moneda no encontrada");
        }
        await repository.restore(id);
    }   
}

export default new CurrencyService()