// app/src/models/survey.model.ts

/**
 * Modelo de Encuesta
 * ------------------
 * Este archivo define el modelo `Survey` de Sequelize,
 * que representa la tabla `surveys` en la base de datos.
 *
 * Almacena las encuestas de satisfacción realizadas por los usuarios
 * después de completar una compra.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface SurveyAttributes {
    id: number;
    orderId: number;
    score: number;
    comments: string;
    createdAt?: Date;
}

/**
 * Atributos para creación.
 */
export interface SurveyCreationAttributes
    extends Optional<SurveyAttributes, "id" | "createdAt"> {}

/**
 * Clase del modelo Survey.
 */
class Survey
    extends Model<SurveyAttributes, SurveyCreationAttributes>
    implements SurveyAttributes
{
    /** Identificador de la encuesta. */
    public id!: number;

    /** Orden evaluada. */
    public orderId!: number;

    /** Calificación otorgada por el usuario. */
    public score!: number;

    /** Comentarios del usuario. */
    public comments!: string;

    /** Fecha de creación de la encuesta. */
    public createdAt?: Date;
}

/**
 * Inicialización del modelo.
 */
Survey.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "order_id",
        },

        score: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },

        comments: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Survey",
        tableName: "surveys",

        timestamps: true,
        createdAt: "created_at",
        updatedAt: false,
    },
);

export default Survey;