import jwt, {SignOptions} from 'jsonwebtoken'
import { UserPayload } from '../services/interfaces/user.payload.interface'

/**
 * funciones principales del jwt
  */

const REFRESH_SECRET = process.env.REFRESH_SECRET

if (!REFRESH_SECRET) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
};

export const generateRefresh = (payload: Omit<UserPayload, 'iat' | 'exp'>):string => {
    const options: SignOptions = {
        expiresIn: (process.env.REFRESH_EXPIRES_IN as SignOptions['expiresIn'])
    }

    return jwt.sign(payload, REFRESH_SECRET, options);
};

export const verifyRefresh = (token: string): UserPayload => {
    return jwt.verify(token, REFRESH_SECRET) as UserPayload;
};