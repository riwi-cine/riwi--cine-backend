// app/src/services/user.service.ts

import { Op } from "sequelize";
import { CreateUserDto } from "../dto/create-user.dto";
import Cinema from "../models/cinema.model";
import City from "../models/city.model";
import Country from "../models/country.model";
import User, { UserCreationAttributes } from "../models/user.model";
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

        const normalizedPassword = dto.passwordHash ?? (dto as any).password;
        const normalizedConfirm = dto.passwordConfirm ?? normalizedPassword;

        if (!normalizedPassword) {
            throw new Error("La contraseña es obligatoria.");
        }

        if (normalizedConfirm !== normalizedPassword) {
            throw new Error("Confirmacion de contraseña incorrecta.");
        }

        const countryId = await this.resolveCountryId(dto.country, dto.countryId);
        const {
            country,
            countryId: _countryId,
            passwordHash,
            passwordConfirm,
            ...userData
        } = dto as CreateUserDto & { countryId?: number };

        return await repository.create({
            ...userData,
            passwordHash: normalizedPassword,
            countryId,
            role: "user",
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
    /**
     * Obtiene un usuario por email o lanza un error si no existe.
     */
    async findOne(email: string): Promise<User> {
        const user = await repository.findOne(email);
        if (!user) {
            throw new Error("El usuario no existe o el correo es incorrecto.");
        }
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

    async updateLocation(userId: number, cityId: number): Promise<User | null> {
        if (!Number.isInteger(userId) || userId <= 0) {
            throw new Error("El ID del usuario autenticado no es válido.");
        }

        if (!Number.isInteger(cityId) || cityId <= 0) {
            throw new Error("El ID de la ciudad debe ser un número válido.");
        }

        const city = await City.findOne({
            where: {
                id: cityId,
                active: true,
            },
            include: [
                {
                    model: Cinema,
                    as: "cinemas",
                    where: { active: true },
                    required: true,
                    attributes: [],
                },
            ],
        });

        if (!city) {
            throw new Error("La ciudad no existe o no tiene cines activos.");
        }

        return await repository.updateById(userId, { cityId });
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
