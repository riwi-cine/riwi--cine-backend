import { hash_password, compare_password } from "../utils/auth";
import User from "../models/user.model";


/**
 * Clase que contiene los metodos para hashing y comparación de contraseñas.
 */
class AuthUser {
    /**
     * 
     * @param {string} password 
     * @returns {Promise<String>} 
     */
    async hashing(password: string): Promise<string> {
        return hash_password(password);
    }

    /**
     * 
     * @param {User} user 
     * @param {String} passwordPlain 
     * @returns {User}
     */
    async login(user: User, passwordPlain: string): Promise<User> {

        const isMatch = await compare_password(passwordPlain, user.passwordHash);

        if (!isMatch) {
            throw new Error("La contraseña es incorrecta.");
        }

        return user;
    }
}

export default new AuthUser();
