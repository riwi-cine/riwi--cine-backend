import {Request, Response, NextFunction} from 'express'

export const roleMiddleware = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({message: "you are not authenticated."})
    }

    const hashrol = allowedRoles.includes(req.user.role)

    if (!hashrol) {
        return res.status(403).json({message: "you dont have alloweds."})
    }

    next()
}}