require('dotenv').config({ path: './.env' }); // Lee tu .env en la raíz del proyecto

module.exports = {
  development: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST || 'db', // Nombre del servicio en docker-compose
    port: 5432, // Puerto interno del contenedor de Postgres
    dialect: 'postgres',
    logging: false
  },
  test: {
    username: process.env.POSTGRES_USER_TEST || process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD_TEST || process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB_TEST || process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST_TEST || process.env.POSTGRES_HOST || 'db',
    port: 5432,
    dialect: 'postgres',
    logging: false
  },
  production: {
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    host: process.env.POSTGRES_HOST,
    dialect: 'postgres',
    logging: false
  }
};