// app/src/repositories/interfaces/user.repository.interface.ts

import User, { UserCreationAttributes } from "../../models/user.model";

/**
 * Contrato del Repositorio de Usuarios
 * -----------------------------------
 * Define las operaciones de persistencia disponibles para la entidad User.
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
     * Obtiene un usuario por email o null si no existe.
     */
    findOne(email: string): Promise<User | null>;

    /**
     * Actualiza un usuario por email.
     */
    update(email: string, data: Partial<UserCreationAttributes>): Promise<User | null>;

    /**
     * Actualiza un usuario por ID.
     */
    updateById(id: number, data: Partial<UserCreationAttributes>): Promise<User | null>;

    /**
     * Elimina un usuario (soft delete).
     */
    delete(email: string): Promise<boolean>;

    /**
     * Restaura un usuario eliminado.
     */
    restore(email: string): Promise<void>;
}