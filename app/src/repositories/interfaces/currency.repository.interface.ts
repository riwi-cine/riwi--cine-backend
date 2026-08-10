// app/src/repository/intefaces/currency.repository.interface.ts

import Currency, { CurrencyCreationAttributes } from "../../models/currency.model";

/**
 * Contrato del Repositorio de Moneda
 * ----------------------------------
 * Define las operaciones de persistencia disponibles para la entidad Currency.
 * 
 * Cualquier implemantación deberá cumplir esta interfaz.
 */

export interface ICurrencyRepository {

    /**
     * Crea una moneda.
     */
    create(data: CurrencyCreationAttributes):
    Promise<Currency>;

    /**
     * Obtiene todas las monedas.
     */
    findAll(): Promise<Currency[]>;

    /**
     * Obtener moneda basado en código.
     */
    findOne(code: string): Promise<Currency>;

    /**
     * Actualiza una moneda.
     */
    update(code: string, data: Partial<CurrencyCreationAttributes>): Promise<Currency | null>;

    /**
     * Elimina una moneda (soft delete).
     */
    delete(code: string): Promise<Boolean>;

    /**
     * Restaura una moneda eliminada.
     */
    restore(code: string): Promise<void>;
}