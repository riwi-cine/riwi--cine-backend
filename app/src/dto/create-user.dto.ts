/**
     * DTO - Creación de Usuario
     *
     * ---
     * Este DTO representa la información necesaria para crear un nuevo usuario.
     *
     * Un DTO (Data Transfer Object) define el contrato de datos entre el cliente
     * y la API, evitando exponer directamente el modelo de base de datos.
     *
     * Se utiliza para:
     *
     * - Estandarizar los datos que se reciben o envían a través de la API.
     * - Validar y tipar los objetos que entran a los controladores.
     * - Evitar exponer directamente los modelos de la base de datos.
     */

    /**
     * Objeto de transferencia de datos para la creación de usuarios.
     *
     * @property {string} country - País del usuario.
     * @property {number} countryId - ID del país (opcional).
     * @property {string} passwordHash - Contraseña del usuario.
     * @property {string} email - Dirección de correo electrónico del usuario.
     * @property {string} firstName - Primer nombre del usuario.
     * @property {string} lastName - Apellido del usuario.
     * @property {string} phone - Número telefónico del usuario.
     * @property {string} birthDate - Fecha de nacimiento del usuario.
     * @property {boolean} marketingOptIn - Indica si el usuario acepta recibir comunicaciones de marketing.
     *
     * @example
     * const dto: CreateUserDto = {
     *   country: "Colombia",
     *   passwordHash: "password123",
     *   email: "luisreyes@example.com",
     *   firstName: "Luis",
     *   lastName: "Reyes",
     *   phone: "3025949099",
     *   birthDate: "1999-04-05",
     *   marketingOptIn: true
     * };
     */

export interface CreateUserDto{
    /**
     * País del usuario.
     *
     * Se acepta como texto (ej: "Colombia") y se transforma a su `countryId`
     * antes de persistir en la base de datos.
     */
    country: string;

    /**
     * ID del país opcional.
     *
     * Permite aceptar un valor numérico directamente si el cliente ya lo conoce.
     */
    countryId?: number;

    /**
     * Contraseña del usuario.
     */
    passwordHash: string;

    /**
     * Confirmar contraseña
     */
    passwordConfirm: string;

    /**
     * Correo electrónico del usuario.
     */
    email: string;

    /**
     * Primer nombre del usuario.
     */
    firstName: string;

    /**
     * Apellido del usuario.
     */
    lastName: string;

    /**
     * Número de teléfono del usuario.
     */
    phone: string;

    /**
     * Fecha de nacimiento del usuario.
     */
    birthDate: Date;

    /**
     * Indica si el usuario acepta recibir comunicaciones de marketing.
     */
    marketingOptIn: boolean;
}
