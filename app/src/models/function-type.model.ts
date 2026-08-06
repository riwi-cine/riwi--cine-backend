// app/src/models/function-type.model.ts

/**
 * Modelo de Tipo de Función
 * -------------------------
 * Este archivo define el modelo `FunctionType` de Sequelize, que representa
 * la tabla `function_types` en la base de datos.
 *
 * Un tipo de función define las características de una proyección,
 * como el tipo de función (Estreno, Matiné), la proyección (2D, 3D, IMAX)
 * y el idioma (Doblada, Subtitulada, etc.).
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad FunctionType.
 */
export interface FunctionTypeAttributes {
    id: number;
    name: string;
    projection: string;
    language: string;
}

/**
 * Atributos utilizados durante la creación.
 */
export interface FunctionTypeCreationAttributes
    extends Optional<FunctionTypeAttributes, "id"> {}

/**
 * Clase que representa el modelo FunctionType.
 */
class FunctionType
    extends Model<FunctionTypeAttributes, FunctionTypeCreationAttributes>
    implements FunctionTypeAttributes
{
    /** Identificador único del tipo de función. */
    public id!: number;

    /** Nombre del tipo de función (Estreno, Matiné, etc.). */
    public name!: string;

    /** Tipo de proyección (2D, 3D, IMAX...). */
    public projection!: string;

    /** Idioma de la proyección. */
    public language!: string;
}

/**
 * Inicialización del modelo FunctionType.
 */
FunctionType.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },

        projection: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },

        language: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "FunctionType",
        tableName: "function_types",
        timestamps: false,
    },
);

export default FunctionType;