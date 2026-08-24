// app/src/repositories/user.repository.ts

import User, { UserCreationAttributes } from "../models/user.model";
import Country from "../models/country.model";
import City from "../models/city.model";
import { IUserRepository } from "./interfaces/user.repository.interface";

/**
 * Repositorio de Usuarios
 */
class UserRepository implements IUserRepository {
    async create(data: UserCreationAttributes): Promise<User> {
        return await User.create(data);
    }

    async findAll(): Promise<User[]> {
        return await User.findAll({
            attributes: { exclude: ["passwordHash"] },
            include: [
                { model: Country, as: "country" },
                { model: City, as: "city" },
            ],
        });
    }

    async findOne(email: string): Promise<User | null> {
        return await User.findOne({ where: { email } });
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

    async delete(email: string): Promise<boolean> {
        const row = await User.destroy({ where: { email } });
        return row > 0;
    }

    async restore(email: string): Promise<void> {
        // El cast a 'any' resuelve la firma de TypeScript si el modelo no fue definido como Paranoid
        await (User as any).restore({ where: { email } });
    }
}

export default new UserRepository();