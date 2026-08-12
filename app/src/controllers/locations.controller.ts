import { Request, Response } from "express";
import { CreateCountryDto } from "../dto/create-locations.dto";
import CountryService from "../services/locations.service";

export const getAllCountries = async (req: Request, res: Response): Promise<Response> => {
    try {
        const countries = await CountryService.findAll();

        return res.status(200).json(countries);
    } catch (error: any) {
        return res.status(500).json({
            error: error.message,
        });
    }
};

export const getCountryByName = async (req: Request, res: Response): Promise<Response> => {
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

export const createCountry = async (req: Request, res: Response): Promise<Response> => {
    try {
        const dto: CreateCountryDto = req.body;

        if (!dto.name || !dto.code || !dto.currencyCode) {
            return res.status(400).json({
                error: "Los campos 'name', 'code' y 'currencyCode' son obligatorios.",
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

export const getDepartments = async (req: Request, res: Response): Promise<Response> => {
    try {
        const countryId = Number(req.params.countryId);

        if (!Number.isInteger(countryId) || countryId <= 0) {
            return res.status(400).json({
                error: "El ID del país debe ser un número válido.",
            });
        }

        const departments = await CountryService.getDepartments(countryId);

        return res.status(200).json(departments);
    } catch (error: any) {
        return res.status(500).json({
            error: error.message,
        });
    }
};

export const getCities = async (req: Request, res: Response): Promise<Response> => {
    try {
        const departmentId = Number(req.params.departmentId);

        if (!Number.isInteger(departmentId) || departmentId <= 0) {
            return res.status(400).json({
                error: "El ID del departamento debe ser un número válido.",
            });
        }

        const cities = await CountryService.getCities(departmentId);

        return res.status(200).json(cities);
    } catch (error: any) {
        return res.status(500).json({
            error: error.message,
        });
    }
};
