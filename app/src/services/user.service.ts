// app/src/services/user.service.ts

import { Op } from "sequelize";
import User, { UserCreationAttributes } from "../models/user.model";
import Country from "../models/country.model";
import { CreateUserDto } from "../dto/create-user.dto";
import repository from "../repositories/user.repository";
import { IUserService } from "./interfaces/user.service.interface";

/**
 * Servicio de Usuarios
 * --------------------
 * Contiene toda la lógica de negocio relacionada con la entidad User.
 *
 * Responsabilidades:
 *  - Validar reglas de negocio.
 *  - Coordinar operaciones entre uno o varios repositorios.
 *  - Orquestar procesos antes y después de persistir información.
 *  - Mantener al controlador libre de lógica de negocio.
 *
 * Ejemplos de reglas de negocio:
 *
 *  Verificar que el correo electrónico no exista antes de crear el usuario.
 *  Validar que el dominio del correo pertenezca a la empresa.
 *  Encriptar la contraseña antes de almacenarla.
 *  Asignar un rol por defecto (Ej. "CLIENTE").
 *  Registrar un log de auditoría de la operación.
 *  Enviar un correo de bienvenida después del registro.
 *  Crear automáticamente un perfil asociado al usuario.
 *
 * El Service conoce las reglas del negocio.
 * El Repository únicamente conoce cómo guardar y consultar información.
 */

class UserService implements IUserService {
    private async resolveCountryId(country?: string, countryId?: number): Promise<number> {
        if (countryId !== undefined && countryId !== null && !Number.isNaN(Number(countryId))) {
            return Number(countryId);
        }

        if (typeof country === "string" && country.trim()) {
            const normalizedCountry = country.trim();
            const countryRecord = await Country.findOne({
                where: {
                    name: {
                        [Op.iLike]: normalizedCountry,
                    },
                },
                attributes: ["id"],
                raw: true,
            });

            if (!countryRecord) {
                throw new Error(`El país "${normalizedCountry}" no existe.`);
            }

            return Number(countryRecord.id);
        }

        throw new Error("Debe enviar un país válido.");
    }

    async create(dto: CreateUserDto): Promise<User> {

        /**
         * Ejemplo de regla de negocio:
         *
         * Antes de crear un usuario podríamos validar que el correo
         * electrónico no se encuentre registrado.
         *
         * const existingUser = await repository.findByEmail(dto.email);
         *
         * if (existingUser) {
         *     throw new Error("El correo electrónico ya se encuentra registrado.");
         * }
         *
         * También podríamos:
         *  - Encriptar la contraseña.
         *  - Asignar un rol por defecto.
         *  - Registrar la operación en una bitácora.
         *  - Enviar un correo de bienvenida.
         */

        const countryId = await this.resolveCountryId(dto.country, dto.countryId);
        const { country, countryId: _countryId, ...userData } = dto as CreateUserDto & { countryId?: number };

        return await repository.create({
            ...userData,
            countryId,
        } as UserCreationAttributes);

    }

    /**
     * Recupera todos los usuarios registrados en el sistema.
     *
     * Este método delega la consulta al repositorio de usuarios, el cual es el
     * responsable de interactuar con la base de datos. En esta capa podrían
     * incorporarse reglas de negocio adicionales, como filtros, paginación,
     * ordenamiento o transformaciones de los datos antes de ser enviados al
     * controlador.
     *
     * @async
     * @returns {Promise<User[]>} Promesa que resuelve con un arreglo de objetos
     *                            de tipo {@link User} que representan los usuarios
     *                            encontrados en la base de datos.
     *
     * @example
     * const users = await userService.findAll();
     *
     * console.log(users);
     *  [
     *    {
     *      id: 1,
     *      name: "David",
     *      email: "david@example.com",
     *      password: "password123"
     *    }
     *  ]
     */
    async findAll(): Promise<User[]> {
        return await repository.findAll();
    }


    /**
     * Este metodo esta encargado de delegar el inicio de sesión o log-in.
     * Toma dos inputs el primero se usa para validar mediante el email si el usuario existe en la base de datos
     * 
     * @param {string} email -Correo electrónico de usuario
     * 
     * @returns {Promise<User>} -Retorna el usuario en forma de promesa luego de la verificación
     */
    async findOne(email: string): Promise<User> {
        const user = await repository.findOne(email);
        return user;
    }

    async update(email: string, dto: Partial<CreateUserDto>): Promise<User | null> {
        const dataToUpdate: Partial<UserCreationAttributes> = { ...dto } as Partial<UserCreationAttributes>;

        if (dto.country !== undefined || dto.countryId !== undefined) {
            const countryId = await this.resolveCountryId(dto.country, dto.countryId);
            dataToUpdate.countryId = countryId;
            delete (dataToUpdate as any).country;
            delete (dataToUpdate as any).countryId;
        }

        return await repository.update(email, dataToUpdate);
    }

    async delete(email: string): Promise<Boolean> {
        const userEmail = await repository.delete(email);
        return userEmail;
    }

    async restore(email: string): Promise<void> {
        const userID = await repository.restore(email);
        return userID;
    }
}

export default new UserService();
