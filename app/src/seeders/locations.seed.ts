import sequelize from "../config/database";
import "../models/associations";
import Cinema from "../models/cinema.model";
import City from "../models/city.model";
import Country from "../models/country.model";
import Currency from "../models/currency.model";
import Department from "../models/department.model";

const seedLocations = async () => {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });

    const [currency] = await Currency.findOrCreate({
        where: { code: "COP" },
        defaults: {
            code: "COP",
            name: "Peso Colombiano",
            symbol: "$",
        },
    });

    const [country] = await Country.findOrCreate({
        where: { code: "CO" },
        defaults: {
            name: "Colombia",
            code: "CO",
            currencyId: currency.id,
            active: true,
        },
    });

    const departments = [
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

    for (const departmentData of departments) {
        const [department] = await Department.findOrCreate({
            where: {
                countryId: country.id,
                name: departmentData.name,
            },
            defaults: {
                countryId: country.id,
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
