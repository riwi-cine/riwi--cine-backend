// app/src/dto/create-currency.dto.ts

/**
 * DTO - Creación de Moneda
 * ------------------------
 * Este DTO representa la información necesaria para crear una nueva moneda.
 *
 * Un DTO (Data Transfer Object) define el contrato de datos entre el cliente
 * y la API, evitando exponer directamente el modelo de base de datos.
 * Se utilizan para:
 *  - Estandarizar los datos que se reciben o envían a través de la API.
 *  - Validar y tipar los objetos que entran a los controladores.
 *  - Evitar exponer directamente los modelos de la base de datos.
 */

/**
 * Objeto de transferencia de datos para la creación de monedas.
 *
 * @property {string} code - Código único de la moneda (ej. USD, EUR).
 * @property {string} name - Nombre completo de la moneda (ej. Dólar estadounidense).
 * @property {string} symbol - Símbolo de la moneda (ej. $).
 *
 * @example
 * const dto: CreateCurrencyDto = {
 *   code: "USD",
 *   name: "Dólar estadounidense",
 *   symbol: "$"
 * };
 */

export interface CreateCurrencyDto {
    /**
     * Código único de la moneda.
     */
    code: string;

    /**
     * Nombre completo de la moneda.
     */
    name: string;

    /**
     * Símbolo de la moneda.
     */
    symbol: string;
}