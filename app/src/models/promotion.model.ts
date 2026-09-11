// app/src/models/promotion.model.ts

/**
 * Modelo de Promoción
 * -------------------
 * Este archivo define el modelo `Promotion` de Sequelize,
 * que representa la tabla `promotions` en la base de datos.
 *
 * Almacena las promociones disponibles dentro de la plataforma,
 * incluyendo su vigencia, tipo de descuento y reglas de uso.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface PromotionAttributes {
    id: number;
    code: string;
    type: string;
    discountValue: number;
    validFrom: Date | string;
    validTo: Date | string;
    maxUsesPerUser: number;
    stackable: boolean;
    active: boolean;
}

/**
 * Atributos para creación.
 */
export interface PromotionCreationAttributes
    extends Optional<PromotionAttributes, "id"> {}

/**
 * Clase del modelo Promotion.
 */
class Promotion
    extends Model<PromotionAttributes, PromotionCreationAttributes>
    implements PromotionAttributes
{
    /** Identificador de la promoción. */
    public id!: number;

    /** Código promocional. */
    public code!: string;

    /** Tipo de promoción. */
    public type!: string;

    /** Valor del descuento. */
    public discountValue!: number;

    /** Fecha de inicio de vigencia. */
    public validFrom!: Date | string;

    /** Fecha de fin de vigencia. */
    public validTo!: Date | string;

    /** Máximo de usos permitidos por usuario. */
    public maxUsesPerUser!: number;

    /** Indica si puede combinarse con otras promociones. */
    public stackable!: boolean;

    /** Estado de la promoción. */
    public active!: boolean;
}

/**
 * Inicialización del modelo.
 */
Promotion.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        code: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
        },

        type: {
            type: DataTypes.STRING(30),
            allowNull: false,
        },

        discountValue: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: "discount_value",
        },

        validFrom: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "valid_from",
        },

        validTo: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "valid_to",
        },

        maxUsesPerUser: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "max_uses_per_user",
        },

        stackable: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },

        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize: sequelize as any,
        modelName: "Promotion",
        tableName: "promotions",

        timestamps: false,
    },
);

export default Promotion;