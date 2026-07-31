// /app/src/config/database.ts

/**
 * Configuración de Sequelize para PostgreSQL
 * ------------------------------------------
 * Este módulo inicializa y exporta una instancia de Sequelize,
 * se configurada con las variables de entorno definidas en `.env` o en `docker-compose`.
 *
 * Uso principal:
 *  - Establecer la conexión con la base de datos PostgreSQL.
 *  - Ser importado por los modelos y utilidades que requieran interactuar con Sequelize.
 *
 * Variables de entorno utilizadas:
 *  - POSTGRES_DB: Nombre de la base de datos.
 *  - POSTGRES_USER: Usuario de conexión a la base de datos.
 *  - POSTGRES_PASSWORD: Contraseña del usuario de la base de datos.
 *  - POSTGRES_HOST: Host de la base de datos (por defecto `db` para docker-compose).
 *  - POSTGRES_PORT: Puerto de conexión (por defecto `5432`).
 */

import { Sequelize } from "sequelize";
import { databaseConfig } from "./database.config";

/**
 * Instancia de Sequelize configurada para PostgreSQL.
 * Se conecta utilizando las credenciales y parámetros definidos en las variables de entorno.
 */
const sequelize = new Sequelize(
    databaseConfig.database,
    databaseConfig.username,
    databaseConfig.password,
    databaseConfig,
);

export default sequelize;
