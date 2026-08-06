// app/src/models/document-type.model.ts

/**
 * Modelo de Tipo de Documento
 * ---------------------------
 * Este archivo define el modelo `DocumentType` de Sequelize, que representa
 * la tabla `document_types` en la base de datos.
 *
 * Un tipo de documento identifica el documento de identidad que puede
 * registrar un usuario (Cédula, Pasaporte, Tarjeta de Identidad, etc.).
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad `DocumentType`.
 */
export interface DocumentTypeAttributes {
    id: number;
    name: string;
}

/**
 * Atributos utilizados durante la creación.
 */
export interface DocumentTypeCreationAttributes
    extends Optional<DocumentTypeAttributes, "id"> {}

/**
 * Clase que representa el modelo DocumentType.
 */
class DocumentType
    extends Model<DocumentTypeAttributes, DocumentTypeCreationAttributes>
    implements DocumentTypeAttributes
{
    /** Identificador único del tipo de documento. */
    public id!: number;

    /** Nombre del documento. */
    public name!: string;
}

/**
 * Inicialización del modelo DocumentType.
 */
DocumentType.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        modelName: "DocumentType",
        tableName: "document_types",
        timestamps: false,
    },
);

export default DocumentType;