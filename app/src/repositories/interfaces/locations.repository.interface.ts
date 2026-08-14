// app/src/repositories/interfaces/country.repository.interface.ts

import Country, { CountryCreationAttributes } from "../../models/country.model";
import City from "../../models/city.model";
import Department from "../../models/department.model";

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
    findOne(id: number): Promise<Country>;

    /**
     * Obtiene los departamentos de un país.
     */
    getDepartmentsByCountry(countryId: number): Promise<Department[]>;

    /**
     * Obtiene ciudades de un departamento con al menos un cine activo.
     */
    getCitiesByDepartment(departmentId: number): Promise<City[]>;
}   
