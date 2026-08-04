// app/src/repositories/user.repository.ts

import User, { UserCreationAttributes } from "../models/user.model";
import { IUserRepository } from "./interfaces/user.repository.interface";

/**
 * Repositorio de Usuarios
 * -----------------------
 * Implementa el patrón Repository para encapsular todas las operaciones
 * de persistencia relacionadas con la entidad User.
 *
 * Esta clase es la única responsable de interactuar con Sequelize.
 */

class UserRepository implements IUserRepository {

    /**
     * Crea un nuevo usuario.
     */
    async create(data: UserCreationAttributes): Promise<User> {

        return await User.create(data);

    }

    /**
     * Obtiene todos los usuarios.
     */
    async findAll(): Promise<User[]> {

        return await User.findAll();

    }

    /**
     * 
     * @param {string} email -Correo electrónico del usuario
     *
     * 
     * @returns {Promise<User>} -Retorna el usuario
     * 
     * @throws {Error} -Mensaje de error si el usuario no existe o no es verificado
     */
    async findOne(email: string): Promise<User> {
        const user = await User.findOne({ where: { email } });
    
        if (!user) {
            throw new Error("Usuario o contraseña incorrectos"); 
        }
        return user; 
    }

    
    async delete(id: number): Promise<Boolean> {
        const row = await User.destroy({where: {id},});
        return row > 0;
    }
    
    async restore(id: number): Promise<void> {
        const row = User.restore({where: {id},});   
        return row;
    }
}

export default new UserRepository();

