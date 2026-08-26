// app/src/repositories/user.repository.ts

import User, { UserCreationAttributes } from "../models/user.model";
import Country from "../models/country.model";
import City from "../models/city.model";
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
        return await User.findAll({
            attributes: { exclude: ["passwordHash"] },
            include: [
                { model: Country, as: "country" },
                { model: City, as: "city" },
            ],
        });
    }

    async findOne(email: string): Promise<User> {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            throw new Error("Usuario o contraseña incorrectos");
        }
        return user;
    }

    async update(email: string, data: Partial<UserCreationAttributes>): Promise<User | null> {
        const user = await User.findOne({ where: { email } });
        if (user) {
            return await user.update(data);
        }
        return null;
    }

    async updateById(id: number, data: Partial<UserCreationAttributes>): Promise<User | null> {
        const user = await User.findByPk(id);
        if (user) {
            return await user.update(data);
        }
        return null;
    }

    async delete(email: string): Promise<Boolean> {
        const row = await User.destroy({ where: { email } });
        return row > 0;
    }

    async restore(email: string): Promise<void> {
        const user = await User.findOne({ where: { email }, paranoid: false });

        if (!user) {
            throw new Error("Usuario no encontrado");
        }
        await user.restore();
        await user.reload();
        return user;
    }
}

export default new UserRepository();
