// app/src/services/interfaces/country.service.interface.ts

import { CreateCountryDto } from "../../dto/create-locations.dto";
import City from "../../models/city.model";
import Country from "../../models/country.model";
import Department from "../../models/department.model";

/**
 * Contrato del Servicio de Países.
 */

export interface ICountryService {
    create(dto: CreateCountryDto): Promise<Country>;

    findAll(): Promise<Country[]>;

    findOne(id: number): Promise<Country | null>;

    getDepartments(countryId: number): Promise<Department[]>;

    getCities(departmentId: number): Promise<City[]>;
}
