// app/src/repositories/interfaces/user.repository.interface.ts

import User, { UserCreationAttributes } from "../../models/user.model";

/**
 * Contrato del Repositorio de Usuarios
 * -----------------------------------
 * Define las operaciones de persistencia disponibles para la entidad User.
 *
 * Cualquier implementación deberá cumplir esta interfaz.
 */

export interface IUserRepository {

    /**
     * Crea un usuario.
     */
    create(data: UserCreationAttributes): Promise<User>;

    /**
     * Obtiene todos los usuarios.
     */
    findAll(): Promise<User[]>;

    /**
     * Obtener usuario basado en email.
     */
    findOne(email: string): Promise<User>;

    /**
     * Actualiza un usuario.
     */
    update(email: string, data: Partial<UserCreationAttributes>): Promise<User | null>;

    /**
     * Elimina un usuario (soft delete).
     */
    delete(email: string): Promise<Boolean>;

    /**
     * Restaura un usuario eliminado.
     */
    restore(email: string): Promise<void>;
}