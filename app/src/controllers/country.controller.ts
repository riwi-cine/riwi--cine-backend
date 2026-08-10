import { Request, Response } from "express";
import { CreateCountryDto } from "../dto/create-country.dto";
import CountryService from "../services/country.service";

export const getAllCountries = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const countries = await CountryService.findAll();

    return res.status(200).json(countries);
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const getCountryByName = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({
        error: "El nombre del país es obligatorio.",
      });
    }

    const country = await CountryService.findOne(name);

    if (!country) {
      return res.status(404).json({
        error: "País no encontrado.",
      });
    }

    return res.status(200).json(country);
  } catch (error: any) {
    return res.status(500).json({
      error: error.message,
    });
  }
};

export const createCountry = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const dto: CreateCountryDto = req.body;

    if (!dto.name || !dto.code || !dto.currencyCode) {
      return res.status(400).json({
        error:
          "Los campos 'name', 'code' y 'currencyCode' son obligatorios.",
      });
    }

    const country = await CountryService.create(dto);

    return res.status(201).json(country);
  } catch (error: any) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

