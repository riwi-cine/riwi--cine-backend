import { Request, Response } from "express";

import userService from "../services/user.service";
import AuthUser from "../services/auth.service";
import { generateToken } from "../utils/jwt";
import { generateRefresh } from '../utils/refreshToken'

/**
 * Inicio de sesión el cual utiliza dos parametros como verificación, correo electrónico y contraseña
 * 
 * @param {Request} req 
 *  Objeto de la petición HTTP
 * 
 * @param {Response} res 
 *  Objeto utilizado para construir la respuesta HTTP.
 * 
 * @returns {Promise<Response>}
 *  * Promesa que resuelve una respuesta HTTP.
 *
 * Posibles respuestas:
 *
 * - **200 OK**
 *   Lista de usuarios obtenida correctamente.
 *
 * - **400**
 * 
 * - **401**
 */
export const findUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).json({
                error: "Email o contraseña invalida."
            });
        }

        const user = await userService.findOne(email);

        const validation = await AuthUser.login(user, password);

        const plainUser = validation.get ? validation.get({ plain: true }) : validation;
        const {passwordHash:_ , ...withoutpassword} = plainUser;

        const token = await generateToken({email: user.email});

        res.cookie('accesstoken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 1000 * 60 * 60
        });

        return res.status(200).json(withoutpassword);

    } catch (error: any) {
        return res.status(401).json({
            error: error.message
        });
    }
};