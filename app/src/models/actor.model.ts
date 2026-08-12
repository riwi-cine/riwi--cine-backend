// app/src/models/actor.model.ts

/**
 * Modelo de Actor
 * ---------------
 * Representa la tabla `actors` de la base de datos.
 *
 * Almacena la información de los actores que pueden participar
 * en una o varias películas.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales del Actor.
 */
export interface ActorAttributes {
    /** Identificador único del actor. */
    id: number;

    /** Nombre del actor. */
    firstName: string;

    /** Apellido del actor. */
    lastName: string | null;

    /** Nombre artístico del actor. */
    stageName: string | null;

    /** Biografía del actor. */
    biography: string | null;

    /** URL de la fotografía del actor. */
    photoUrl: string | null;

    /** Indica si el actor está activo en la plataforma. */
    active: boolean;
}

/**
 * Atributos utilizados al crear un Actor.
 *
 * El id es generado automáticamente por la base de datos.
 */
export interface ActorCreationAttributes
    extends Optional<ActorAttributes, "id"> {}

/**
 * Clase que representa el modelo Actor.
 */
class Actor
    extends Model<ActorAttributes, ActorCreationAttributes>
    implements ActorAttributes
{
    /** Identificador único del actor. */
    public id!: number;

    /** Nombre del actor. */
    public firstName!: string;

    /** Apellido del actor. */
    public lastName!: string | null;

    /** Nombre artístico del actor. */
    public stageName!: string | null;

    /** Biografía del actor. */
    public biography!: string | null;

    /** URL de la fotografía del actor. */
    public photoUrl!: string | null;

    /** Indica si el actor está activo. */
    public active!: boolean;
}

/**
 * Inicialización del modelo Actor.
 */
Actor.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        firstName: {
            type: DataTypes.STRING(100),
            allowNull: false,
            field: "first_name",
        },

        lastName: {
            type: DataTypes.STRING(100),
            allowNull: true,
            field: "last_name",
        },

        stageName: {
            type: DataTypes.STRING(150),
            allowNull: true,
            field: "stage_name",
        },

        biography: {
            type: DataTypes.TEXT,
            allowNull: true,
        },

        photoUrl: {
            type: DataTypes.STRING(500),
            allowNull: true,
            field: "photo_url",
        },

        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize,
        modelName: "Actor",
        tableName: "actors",

        // El MER no define created_at ni updated_at.
        timestamps: false,
    },
);

export default Actor;