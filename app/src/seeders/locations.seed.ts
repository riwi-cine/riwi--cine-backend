import dbInstance from "../config/database";
import "../models/associations";
import CinemaModel from "../models/cinema.model";
import CityModel from "../models/city.model";
import CountryModel from "../models/country.model";
import CurrencyModel from "../models/currency.model";
import DepartmentModel from "../models/department.model";

// Casteos para evitar los conflictos de tipado estático en el script de seed
const sequelize: any = dbInstance;
const Currency: any = CurrencyModel;
const Country: any = CountryModel;
const Department: any = DepartmentModel;
const City: any = CityModel;
const Cinema: any = CinemaModel;

const seedLocations = async () => {
    await sequelize.authenticate();
    // ⚠️ Ya NO se hace sync({ alter: true }) aquí.
    // La estructura de las tablas la maneja únicamente sequelize-cli (src/migrations/*).
    // Antes de correr este seed, asegúrate de haber corrido: npx sequelize-cli db:migrate

    const [copCurrency] = await Currency.findOrCreate({
        where: { code: "COP" },
        defaults: {
            code: "COP",
            name: "Peso Colombiano",
            symbol: "$",
        },
    });

    const [colombia] = await Country.findOrCreate({
        where: { code: "CO" },
        defaults: {
            name: "Colombia",
            code: "CO",
            currencyId: copCurrency.id,
            active: true,
        },
    });

    const colombiaDepartments = [
        {
            name: "Antioquia",
            cities: [
                { name: "Medellin", hasActiveCinema: true },
                { name: "Envigado", hasActiveCinema: true },
            ],
        },
        {
            name: "Cundinamarca",
            cities: [{ name: "Bogota", hasActiveCinema: true }],
        },
        {
            name: "Valle del Cauca",
            cities: [{ name: "Cali", hasActiveCinema: false }],
        },
    ];

    for (const departmentData of colombiaDepartments) {
        const [department] = await Department.findOrCreate({
            where: {
                countryId: colombia.id,
                name: departmentData.name,
            },
            defaults: {
                countryId: colombia.id,
                name: departmentData.name,
                active: true,
            },
        });

        for (const cityData of departmentData.cities) {
            const [city] = await City.findOrCreate({
                where: {
                    departmentId: department.id,
                    name: cityData.name,
                },
                defaults: {
                    departmentId: department.id,
                    name: cityData.name,
                    active: true,
                },
            });

            if (cityData.hasActiveCinema) {
                await Cinema.findOrCreate({
                    where: {
                        cityId: city.id,
                        name: `Riwi Cine ${cityData.name}`,
                    },
                    defaults: {
                        cityId: city.id,
                        name: `Riwi Cine ${cityData.name}`,
                        address: `Centro comercial principal de ${cityData.name}`,
                        active: true,
                    },
                });
            }
        }
    }

    const [vesCurrency] = await Currency.findOrCreate({
        where: { code: "VES" },
        defaults: {
            code: "VES",
            name: "Bolívar Venezolano",
            symbol: "Bs.",
        },
    });

    const [venezuela] = await Country.findOrCreate({
        where: { code: "VE" },
        defaults: {
            name: "Venezuela",
            code: "VE",
            currencyId: vesCurrency.id,
            active: true,
        },
    });

    const venezuelaDepartments = [
        {
            name: "Distrito Capital",
            cities: [{ name: "Caracas", hasActiveCinema: true }],
        },
        {
            name: "Carabobo",
            cities: [{ name: "Valencia", hasActiveCinema: false }],
        },
    ];

    for (const departmentData of venezuelaDepartments) {
        const [department] = await Department.findOrCreate({
            where: {
                countryId: venezuela.id,
                name: departmentData.name,
            },
            defaults: {
                countryId: venezuela.id,
                name: departmentData.name,
                active: true,
            },
        });

        for (const cityData of departmentData.cities) {
            const [city] = await City.findOrCreate({
                where: {
                    departmentId: department.id,
                    name: cityData.name,
                },
                defaults: {
                    departmentId: department.id,
                    name: cityData.name,
                    active: true,
                },
            });

            if (cityData.hasActiveCinema) {
                await Cinema.findOrCreate({
                    where: {
                        cityId: city.id,
                        name: `Riwi Cine ${cityData.name}`,
                    },
                    defaults: {
                        cityId: city.id,
                        name: `Riwi Cine ${cityData.name}`,
                        address: `Centro comercial principal de ${cityData.name}`,
                        active: true,
                    },
                });
            }
        }
    }
};

seedLocations()
    .then(async () => {
        console.log("Seed de ubicaciones ejecutado correctamente.");
        await sequelize.close();
    })
    .catch(async error => {
        console.error("Error ejecutando seed de ubicaciones:", error);
        await sequelize.close();
        process.exit(1);
    });