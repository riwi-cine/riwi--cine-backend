// app/src/models/function.model.ts

/**
 * Modelo de Función
 * -----------------
 * Este archivo define el modelo `Function` de Sequelize, que representa
 * la tabla `functions` en la base de datos.
 *
 * Una función representa la proyección de una película en una sala
 * específica, en una fecha y hora determinadas.
 */

import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

/**
 * Atributos principales de la entidad Function.
 */
export interface FunctionAttributes {
  id: number;
  movieId: number;
  roomId: number;
  functionTypeId: number;
  startsAt: Date;
  basePrice: number;
  active: boolean;
}

/**
 * Atributos utilizados durante la creación.
 */
export interface FunctionCreationAttributes
  extends Optional<FunctionAttributes, "id" | "active"> {}

/**
 * Clase que representa el modelo Function.
 */
class Function
  extends Model<FunctionAttributes, FunctionCreationAttributes>
  implements FunctionAttributes
{
  /** Identificador único de la función. */
  public id!: number;

  /** Película que se proyectará. */
  public movieId!: number;

  /** Sala donde se proyectará la función. */
  public roomId!: number;

  /** Tipo de función. */
  public functionTypeId!: number;

  /** Fecha y hora de inicio. */
  public startsAt!: Date;

  /** Precio base del boleto. */
  public basePrice!: number;

  /** Indica si la función está activa o no. */
  public active!: boolean;
}

/**
 * Inicialización del modelo Function.
 */
Function.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "movie_id",
    },

    roomId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "room_id",
    },

    functionTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "function_type_id",
    },

    startsAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "starts_at",
    },

    basePrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      field: "base_price",
    },

    active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
      field: "active",
    },
  },
  {
    sequelize,
    modelName: "Function",
    tableName: "functions",
    timestamps: false,
  },
);

export default Function;