import jwt, {SignOptions} from 'jsonwebtoken'
import { UserPayload } from '../services/interfaces/user.payload.interface'

 /**
  * funciones principales del jwt
  */

const JWT_SECRET = process.env.JWT_SECRET

if (!JWT_SECRET) {
    throw new Error('JWT_SECRET no está definido en las variables de entorno');
};

export const generateToken = (payload: Omit<UserPayload, 'iat' | 'exp'>):string => {
    const options: SignOptions = {
        expiresIn:(process.env.JWT_EXPIRES_IN as SignOptions['expiresIn'])
    }

    return jwt.sign(payload, JWT_SECRET, options);
};

export const verifytoken = (token: string): UserPayload => {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
};
