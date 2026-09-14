// app/src/repositories/country.repository.ts

import Country, { CountryCreationAttributes } from "../models/country.model";
import City from "../models/city.model";
import Cinema from "../models/cinema.model";
import Department from "../models/department.model";
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
    async findOne(id: number): Promise<Country> {
        const country = await Country.findOne({ where: { id } });
        if (!country) {
            throw new Error("País no encontrado");
        }
        return country;
    }

    async getDepartmentsByCountry(countryId: number): Promise<Department[]> {
        return await Department.findAll({
            where: {
                countryId,
                active: true,
            },
            order: [["name", "ASC"]],
        });
    }

    async getCitiesByDepartment(departmentId: number): Promise<City[]> {
        return await City.findAll({
            where: {
                departmentId,
                active: true,
            },
            include: [
                {
                    model: Cinema,
                    as: "cinemas",
                    where: { active: true },
                    required: true,
                    attributes: [],
                },
            ],
            order: [["name", "ASC"]],
        });
    }
}

export default new CountryRepository();
