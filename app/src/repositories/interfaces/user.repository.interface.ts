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
     * Obtener usuario basado en email y autentica con contraseña.
    */
    findOne(email: string, password: string): Promise<User>;

}