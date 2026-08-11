// app/src/repositories/country.repository.ts

import Country, { CountryCreationAttributes } from "../models/country.model";
import { ICountryRepository } from "./interfaces/locations.repository.interface";

/**
 * Repositorio de Países
 * ---------------------
 * Implementa el patrón Repository para encapsular todas las operaciones
 * de persistencia relacionadas con la entidad Country.
 *
 * Esta clase es la única responsable de interactuar con Sequelize.
 */

class CountryRepository implements ICountryRepository {
    /**
     * Crea un nuevo país.
     */
    async create(data: CountryCreationAttributes): Promise<Country> {
        return await Country.create(data);
    }

    /**
     * Obtiene todos los países.
     */
    async findAll(): Promise<Country[]> {
        return await Country.findAll();
    }

    /**
     * Obtiene un país por su nombre.
     */
    async findOne(name: string): Promise<Country> {
        const country = await Country.findOne({ where: { name } });
        if (!country) {
            throw new Error("País no encontrado");
        }
        return country;
    }
}

export default new CountryRepository();
