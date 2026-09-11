// app/src/models/cinema-snack.model.ts

/**
 * Modelo de Snacks por Cine
 * -------------------------
 * Este archivo define el modelo `CinemaSnack` de Sequelize,
 * que representa la tabla `cinema_snacks` en la base de datos.
 *
 * Relaciona los snacks disponibles en cada cine,
 * junto con su precio, inventario y disponibilidad.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales.
 */
export interface CinemaSnackAttributes {
    id: number;
    cinemaId: number;
    snackId: number;
    price: number;
    stock: number;
    active: boolean;
}

/**
 * Atributos para creación.
 */
export interface CinemaSnackCreationAttributes
    extends Optional<CinemaSnackAttributes, "id"> {}

/**
 * Clase del modelo CinemaSnack.
 */
class CinemaSnack
    extends Model<CinemaSnackAttributes, CinemaSnackCreationAttributes>
    implements CinemaSnackAttributes
{
    /** Identificador del registro. */
    public id!: number;

    /** Cine propietario del snack. */
    public cinemaId!: number;

    /** Snack disponible. */
    public snackId!: number;

    /** Precio del snack en este cine. */
    public price!: number;

    /** Inventario disponible. */
    public stock!: number;

    /** Disponibilidad del producto. */
    public active!: boolean;
}

/**
 * Inicialización del modelo.
 */
CinemaSnack.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        cinemaId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "cinema_id",
        },

        snackId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "snack_id",
        },

        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },

        stock: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },

        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true,
        },
    },
    {
        sequelize,
        modelName: "CinemaSnack",
        tableName: "cinema_snacks",

        timestamps: false,

        indexes: [
            {
                unique: true,
                fields: ["cinema_id", "snack_id"],
            },
        ],
    },
);

export default CinemaSnack;