import {JwtPayload} from 'jsonwebtoken'

    export interface UserPayload extends JwtPayload {
        email: string;
    }

declare global {
    namespace Express {
        interface Request {
            user?:UserPayload
        }
    }
}