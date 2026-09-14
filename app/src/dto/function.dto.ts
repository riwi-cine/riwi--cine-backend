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

/**
 * Esta es la respuesta esperada para algunas parte del CRUD findOne, además se usará en varias capas como billboard, movie o en cart.
 */
export interface FunctionDetail {
    id: number;
    startsAt: Date;
    basePrice: number;
    active: boolean;
    functionType: {
        id: number;
        name: string;
        projection: string;
        language: string;
    } | null;
    room: {
        id: number;
        name: string;
        capacity: number;
        extraPrice: number;
        roomType: {
            id: number;
            name: string;
            description: string;
        } | null;
        cinema: {
            id: number;
            name: string;
            address: string;
            city: {
                id: number;
                name: string;
            } | null;
        } | null;
    } | null;
    movieRelease?: {
        id: number;
        releaseDate: Date;
        countryId: number;
        movie?: {
          id: number;
          title: string;
        }
    };
    ticketsCount: number;
    seatLocksCount: number;
    isSoldOut?: boolean | null;
}

export interface FunctionPriceDetail {
    functionId: number;
    basePrice: number;
    roomExtraPrice: number;
    finalPrice: number;
}