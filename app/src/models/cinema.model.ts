// app/src/models/cinema.model.ts

/**
 * Modelo de Cine
 * --------------
 * Este archivo define el modelo `Cinema` de Sequelize, que representa la tabla
 * `cinemas` en la base de datos.
 *
 * Contiene:
 *  - Atributos del modelo (`CinemaAttributes`).
 *  - Atributos requeridos para la creación (`CinemaCreationAttributes`).
 *  - Definición del modelo con sus columnas y restricciones.
 *
 * Cada cine pertenece a una ciudad.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad `Cinema`.
 */
export interface CinemaAttributes {
    id: number;
    cityId: number;
    name: string;
    address: string;
    active: boolean;
}

/**
 * Atributos utilizados para la creación de un nuevo cine.
 */
export interface CinemaCreationAttributes
    extends Optional<CinemaAttributes, "id"> {}

/**
 * Clase que representa el modelo `Cinema`.
 */
class Cinema
    extends Model<CinemaAttributes, CinemaCreationAttributes>
    implements CinemaAttributes
{
    /** Identificador único del cine. */
    public id!: number;

    /** Ciudad donde se encuentra el cine. */
    public cityId!: number;

    /** Nombre del cine. */
    public name!: string;

    /** Dirección del cine. */
    public address!: string;

    /** Estado del cine. */
    public active!: boolean;
}

/**
 * Inicialización del modelo `Cinema`.
 */
Cinema.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        cityId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "city_id",
        },

        name: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },

        address: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },

        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize,
        modelName: "Cinema",
        tableName: "cinemas",
        timestamps: false,
    },
);

export default Cinema;