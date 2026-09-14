// app/src/repository/currency.repository.ts

import Currency, { CurrencyCreationAttributes } from "../models/currency.model";
import { ICurrencyRepository } from "./interfaces/currency.repository.interface";

/**
 * Repositorio de Monedas
 * ----------------------
 * Implementa el patrón Repository para encapsular todas las operaciones
 * de persistencia relacionadas con la entidad Currency.
 *
 * Esta clase es la única responsable de interactuar con Sequelize.
 */

class CurrencyRepository implements ICurrencyRepository {

    /**
     * Crea una nueva moneda.
     */
    async create(data: CurrencyCreationAttributes): Promise<Currency> {
        return await Currency.create(data);
    }

    /**
     * Obtiene todas las monedas.
     */
    async findAll(): Promise<Currency[]> {
        return await Currency.findAll();
    }

    /**
     * Obtiene una moneda por su código.
     */
    async findOne(id: number): Promise<Currency> {
        const currency = await Currency.findOne({ where: { id } });
        if (!currency) {
            throw new Error("Moneda no encontrada");
        }
        return currency;
    }

    /**
     * Actualiza una moneda existente.
     */ 
    async update(id: number, data: Partial<CurrencyCreationAttributes>): Promise<Currency | null> {
        const currency = await Currency.findOne({ where: { id } });
        if (currency) {
            return await currency.update(data);
        }
        return null;
    }

    /**
     * Elimina una moneda (soft delete).
     */
    async delete(id: number): Promise<Boolean> {
        const row = await Currency.destroy({ where: { id } });
        return row > 0;
    }

    /**
     * Restaura una moneda eliminada.
     */
    async restore(id: number): Promise<void> {
        const currency = await Currency.findOne({ where: { id }, paranoid: false });
        if (currency) {
            await currency.restore();
        } else {
            throw new Error("Moneda no encontrada");
        }
    }    
}

export default new CurrencyRepository();