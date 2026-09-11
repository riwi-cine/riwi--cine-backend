import {Request, Response, NextFunction} from 'express'
import userService from '../services/user.service'

export const roleMiddleware = (allowedRoles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
        return res.status(401).json({message: "you are not authenticated."})
    }
    const userGoal = req.params?.email
    const userData = await userService.findOne(req.user.email)

    const rol = allowedRoles.includes(userData.role)

    if (rol) {
        return next()
    } else if (userData.email === userGoal) {
        return next()
    }

    return res.status(403).json({message: "Forbidden: you are not alloweds."})
}}