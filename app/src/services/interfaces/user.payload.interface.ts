import {JwtPayload} from 'jsonwebtoken'

    export interface UserPayload extends JwtPayload {
        id: number
        name: string
        role: string
        country_id: number
    }

declare global {
    namespace Express {
        interface Request {
            user?:UserPayload
        }
    }
}