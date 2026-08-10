// app/src/services/interfaces/country.service.interface.ts

import { CreateCountryDto } from "../../dto/create-country.dto";
import Country from "../../models/country.model";

/**
 * Contrato del Servicio de Países.
 */

export interface ICountryService {
    create(dto: CreateCountryDto): Promise<Country>;

    findAll(): Promise<Country[]>;

    findOne(name: string): Promise<Country | null>;
}