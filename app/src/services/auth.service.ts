import { hash_password, compare_password } from "../utils/auth";
import User from "../models/user.model";

class AuthUser {
    async hashing(password: string): Promise<string> {
        return hash_password(password);
    }

    async login(user: User, passwordPlain: string): Promise<User> {

        const isMatch = await compare_password(passwordPlain, user.password);

        if (!isMatch) {
            throw new Error("La contraseña es incorrecta.");
        }

        return user;
    }
}

export default new AuthUser();
