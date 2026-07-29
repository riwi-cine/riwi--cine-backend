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

    async findOne(email: string, password: string): Promise<User> {
        const user = await User.findOne({ where: { email } });
    
        if (!user) {
            throw new Error("Usuario o contraseña incorrectos"); 
        }
    
        if (password != user.password) {
            throw new Error("Usuario o contraseña incorrectos"); 
        }
        return user; 
    }
}

export default new UserRepository();

