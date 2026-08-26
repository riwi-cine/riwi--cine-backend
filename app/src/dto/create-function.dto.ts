/**
 * DTO - Creación de Función
 * -------------------------
 * Este DTO representa la información necesaria para programar una nueva función.
 * Define el contrato de datos entre el cliente (frontend) y la API.
 */
export interface CreateFunctionDto {
    /**
     * ID de la película que se proyectará.
     */
    movieId?: number;

    /**
     * ID de la sala donde se proyectará la función.
     */
    roomId?: number;

    /**
     * ID del tipo de función (ej. 2D, 3D, VIP, Subtitulada).
     */
    functionTypeId?: number;

    /**
     * Fecha y hora de inicio de la función.
     * Se recibe como string (ISO 8601) desde el cliente y se tipa como Date para Sequelize.
     */
    startsAt: Date ;

    /**
     * Precio base del boleto para esta función específica.
     */
    basePrice: number;

    /**
     * Estado de la función. Opcional, ya que por defecto es true en la base de datos.
     */
    active?: boolean;
}