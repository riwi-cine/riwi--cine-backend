// app/src/models/cineflash-activation.model.ts

/**
 * Modelo de Activación CineFlash
 * ------------------------------
 * Este archivo define el modelo `CineFlashActivation` de Sequelize,
 * que representa la tabla `cineflash_activations` en la base de datos.
 *
 * Registra cuándo una función activa la promoción CineFlash,
 * el porcentaje de ocupación en ese momento y cuándo finaliza
 * dicha promoción.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad CineFlashActivation.
 */
export interface CineFlashActivationAttributes {
    id: number;
    functionId: number;
    activatedAt: Date;
    occupancyPct: number;
    deactivatedAt: Date | null;
}

/**
 * Atributos utilizados durante la creación.
 */
export interface CineFlashActivationCreationAttributes
    extends Optional<
        CineFlashActivationAttributes,
        "id" | "deactivatedAt"
    > {}

/**
 * Clase que representa el modelo CineFlashActivation.
 */
class CineFlashActivation
    extends Model<
        CineFlashActivationAttributes,
        CineFlashActivationCreationAttributes
    >
    implements CineFlashActivationAttributes
{
    /** Identificador único de la activación. */
    public id!: number;

    /** Función asociada a la promoción. */
    public functionId!: number;

    /** Fecha y hora en la que se activó la promoción. */
    public activatedAt!: Date;

    /** Porcentaje de ocupación al momento de activarse. */
    public occupancyPct!: number;

    /** Fecha y hora en que terminó la promoción. */
    public deactivatedAt!: Date | null;
}

/**
 * Inicialización del modelo CineFlashActivation.
 */
CineFlashActivation.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        functionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "function_id",
        },

        activatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            field: "activated_at",
        },

        occupancyPct: {
            type: DataTypes.DECIMAL(5, 2),
            allowNull: false,
            field: "occupancy_pct",
        },

        deactivatedAt: {
            type: DataTypes.DATE,
            allowNull: true,
            field: "deactivated_at",
        },
    },
    {
        sequelize,
        modelName: "CineFlashActivation",
        tableName: "cineflash_activations",
        timestamps: true,
    },
);

export default CineFlashActivation;