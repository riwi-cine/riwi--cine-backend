// app/src/repositories/interfaces/country.repository.interface.ts

import Country, { CountryCreationAttributes } from "../../models/country.model";

/**
 * Contrato del Repositorio de Países
 * -----------------------------------
 * Define las operaciones de persistencia disponibles para la entidad Country.
 *
 * Cualquier implementación deberá cumplir esta interfaz.
 */

export interface ICountryRepository {

    /**
     * Crea un país.
     */
    create(data: CountryCreationAttributes): Promise<Country>;

    /**
     * Obtiene todos los países.
     */
    findAll(): Promise<Country[]>;

    /**
     * Obtener país basado en su nombre.
     */
    findOne(name: string): Promise<Country>;
}   