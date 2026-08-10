/**
 * DTO creación de país.
 * 
 * ---
 * Este DTO se utiliza para la creación de un nuevo país en el sistema.
 * 
 */

/**
 * Objeto de transferencia de datos para la creación de un país.
 * 
 * @property {string} name - Nombre del país.
 * @property {string} currencyCode - Código de la moneda asociada al país.
 * @property {string} code - Código del país (ISO 3166-1 alpha-2).
 * 
 */
export interface CreateCountryDto {
    /**
     * Nombre del país.
     */
    name: string;

    /**
     * Código de la moneda asociada al país.
     */
    currencyCode: string;

    /**
     * currencyId - ID de la moneda asociada al país (opcional).
     * 
     * Permite aceptar un valor numérico directamente si el cliente ya lo conoce.
     */
    currencyId?: number;

    /**
     * Código del país (ISO 3166-1 alpha-2).
     */
    code: string;
}