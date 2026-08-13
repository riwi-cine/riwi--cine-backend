import { Request, Response, NextFunction } from 'express'
import {verifytoken} from '../utils/jwt'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accesstoken

    if (!token) {
        return res.status(401).json({ message: 'No se encontró el token en las cookies' });
    }
    try {
        const decoded = verifytoken(token)

        req.user = decoded

        next()  
    } catch {
        res.clearCookie('accessToken');
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};
