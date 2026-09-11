// app/src/models/user-document.model.ts

/**
 * Modelo de Documento de Usuario
 * ------------------------------
 * Este archivo define el modelo `UserDocument` de Sequelize,
 * que representa la tabla `user_documents` en la base de datos.
 *
 * Relaciona un usuario con su documento de identidad y su tipo
 * de documento.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface UserDocumentAttributes {
    id: number;
    userId: number;
    documentTypeId: number;
    documentNumber: string;
    verifiedAt: Date | null;
}

/**
 * Atributos para creación.
 */
export interface UserDocumentCreationAttributes
    extends Optional<UserDocumentAttributes, "id" | "verifiedAt"> {}

/**
 * Clase del modelo UserDocument.
 */
class UserDocument
    extends Model<
        UserDocumentAttributes,
        UserDocumentCreationAttributes
    >
    implements UserDocumentAttributes
{
    /** Identificador del documento. */
    public id!: number;

    /** Usuario propietario del documento. */
    public userId!: number;

    /** Tipo de documento. */
    public documentTypeId!: number;

    /** Número del documento. */
    public documentNumber!: string;

    /** Fecha de verificación del documento. */
    public verifiedAt!: Date | null;
}

/**
 * Inicialización del modelo.
 */
UserDocument.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "user_id",
        },

        documentTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "document_type_id",
        },

        documentNumber: {
            type: DataTypes.STRING(50),
            allowNull: false,
            field: "document_number",
        },

        verifiedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "verified_at",
        },
    },
    {
        sequelize,
        modelName: "UserDocument",
        tableName: "user_documents",
        timestamps: false,

        indexes: [
            {
                unique: true,
                fields: ["document_type_id", "document_number"],
            },
        ],
    },
);

export default UserDocument;