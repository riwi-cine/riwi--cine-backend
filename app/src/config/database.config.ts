export const databaseConfig = {
    username: process.env.POSTGRES_USER!,
    password: process.env.POSTGRES_PASSWORD!,
    database: process.env.POSTGRES_DB!,
    host: process.env.POSTGRES_HOST || "db",
    port: Number(process.env.POSTGRES_PORT || "5432"),
    dialect: "postgres" as const,
    logging: false,
};
