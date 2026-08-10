// app/services/country.service.ts

import { Op } from "sequelize";
import Country from "../models/country.model";
import Currency from "../models/currency.model";
import { CreateCountryDto } from "../dto/create-country.dto";
import repository from "../repositories/country.repository";
import { ICountryService } from "./interfaces/country.service.interface";

/**
 * Servicio de Países
 *
 * ---
 * Contiene toda la lógica de negocio relacionada con la entidad Country.
 *
 * Responsabilidades:
 *
 * - Validar reglas de negocio.
 * - Coordinar operaciones entre uno o varios repositorios.
 * - Orquestar procesos antes y después de persistir información.
 * - Mantener al controlador libre de lógica de negocio.
 *
 * El Service conoce las reglas del negocio.
 * El Repository únicamente conoce cómo guardar y consultar información.
 */

class CountryService implements ICountryService {
  /**
   * Resuelve el ID de una moneda a partir de su código.
   *
   * El DTO recibe `currencyCode` para no exponer directamente
   * el identificador interno de la base de datos.
   */
  private async resolveCurrencyId(currencyCode: string): Promise<number> {
    const normalizedCurrencyCode = currencyCode.trim().toUpperCase();

    if (!normalizedCurrencyCode) {
      throw new Error("Debe enviar un código de moneda válido.");
    }

    const currency = await Currency.findOne({
      where: {
        code: {
          [Op.iLike]: normalizedCurrencyCode,
        },
      },
      attributes: ["id"],
      raw: true,
    });

    if (!currency) {
      throw new Error(
        `La moneda "${normalizedCurrencyCode}" no existe.`
      );
    }

    return Number(currency.id);
  }

  async create(dto: CreateCountryDto): Promise<Country> {
    const currencyId = await this.resolveCurrencyId(dto.currencyCode);

    const countryData = {
      name: dto.name,
      code: dto.code,
      currencyId,
    };

    return await repository.create(countryData);
  }

  async findAll(): Promise<Country[]> {
    return await repository.findAll();
  }

  async findOne(name: string): Promise<Country | null> {
    try {
      return await repository.findOne(name);
    } catch (error) {
      return null;
    }
  }
}

export default new CountryService();

