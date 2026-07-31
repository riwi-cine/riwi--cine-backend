
import { hash_password, compare_password } from "../utils/auth";
import User from "../models/user.model";

class AuthUser {
    async hashing(password:string): Promise<string>{
        return hash_password(password);
    }

    async login(user: User, password: string): Promise<boolean>{
        return compare_password(password, user.password);
    }
}

export default new AuthUser