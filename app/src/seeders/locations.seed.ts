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

    console.log("Seed de ubicaciones ejecutado correctamente.");
    await sequelize.close();
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
