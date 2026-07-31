require("dotenv").config();

module.exports = {
    development: {
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        host: process.env.POSTGRES_HOST || "db",
        port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
        dialect: "postgres",
        logging: false,
    },

    test: {
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        host: process.env.POSTGRES_HOST || "db",
        port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
        dialect: "postgres",
        logging: false,
    },

    production: {
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
        host: process.env.POSTGRES_HOST || "db",
        port: parseInt(process.env.POSTGRES_PORT || "5432", 10),
        dialect: "postgres",
        logging: false,
    },
};
