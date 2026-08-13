import { Request, Response } from "express";

import userService from "../services/user.service";
import { CreateUserDto } from "../dto/create-user.dto";
import AuthUser from "../services/auth.service";

/**
 * ============================================================================
 * Controlador de Usuarios
 * ============================================================================
 *
 * Este controlador gestiona las solicitudes HTTP relacionadas con la entidad `User`.
 *
 * Su única responsabilidad es actuar como intermediario entre el cliente
 * (HTTP) y la capa de servicios, delegando toda la lógica de negocio al `UserService`.
 *
 * Responsabilidades:
 *  - Recibir y procesar las solicitudes HTTP.
 *  - Obtener la información enviada por el cliente.
 *  - Invocar el servicio correspondiente.
 *  - Construir la respuesta HTTP.
 *  - Retornar los códigos de estado apropiados.
 *
 * Este controlador NO debe:
 *  - Contener reglas de negocio.
 *  - Acceder directamente a la base de datos.
 *  - Ejecutar consultas mediante Sequelize.
 *  - Realizar validaciones complejas del dominio.
 *
 * Arquitectura:
 *
 * Cliente HTTP
 *      │
 * UserController
 *      │
 * UserService
 *      │
 * UserRepository
 *      │
 * Sequelize
 *      │
 * PostgreSQL
 * ============================================================================
 */

/**
 * Crea un nuevo usuario.
 *
 * Recibe la información enviada por el cliente, construye el DTO de creación
 * y delega la operación al servicio correspondiente.
 *
 * @async
 *
 * @param {Request} req
 * Objeto de la petición HTTP.
 *
 * Espera recibir en el body:
 * @example
 *  {
 *    "country": "Colombia",
 *    "passwordHash": "password123",
 *    "email": "luisreyes@example.com",
 *    "firstName": "Luis",
 *    "lastName": "Reyes",
 *    "phone": "3025949099",
 *    "birthDate": "1999-04-05",
 *    "marketingOptIn": true
 *  }
 *
 * @param {Response} res
 * Objeto utilizado para construir la respuesta HTTP.
 *
 * @returns {Promise<Response>}
 * Promesa que resuelve una respuesta HTTP.
 *
 * Posibles respuestas:
 *
 * - **201 Created**
 *   Usuario creado correctamente.
 *
 * - **500 Internal Server Error**
 *   Error inesperado durante el procesamiento.
 *
 * @throws {Error}
 * Cualquier excepción generada por la capa de servicios será capturada
 * y retornada como una respuesta HTTP con código 500.
 */
export const createUser = async (req: Request, res: Response): Promise<Response> => {

    try {

        // Construcción del DTO recibido desde el cliente.
        const dto: CreateUserDto = req.body;

        // Delega la lógica de negocio al servicio.
        const user = await userService.create(dto);

        // Retorna el recurso creado.
        return res.status(201).json(user);

    } catch (error: any) {

        return res.status(500).json({
            error: error.message
        });

    }

};

/**
 * Obtiene el listado completo de usuarios.
 *
 * Delega la consulta a la capa de servicios, la cual será responsable de
 * aplicar cualquier regla de negocio antes de consultar el repositorio.
 *
 * @async
 *
 * @param {Request} _req
 * Objeto de la petición HTTP.
 *
 * En este endpoint no se utiliza, por ello se antepone "_" al nombre de la
 * variable para indicar explícitamente que el parámetro es requerido por
 * Express pero no será utilizado.
 *
 * @param {Response} res
 * Objeto utilizado para construir la respuesta HTTP.
 *
 * @returns {Promise<Response>}
 * Promesa que resuelve una respuesta HTTP.
 *
 * Posibles respuestas:
 *
 * - **200 OK**
 *   Lista de usuarios obtenida correctamente.
 *
 * - **500 Internal Server Error**
 *   Error inesperado durante la consulta.
 *
 * @example
 * [
 *  {
 *   "id": 1,
 *   "countryId": 1,
 *   "email": "natalia@example.com",
 *   "firstName": "Natalia",
 *   "lastName": "Reyes",
 *   "phone": "3025949099",
 *   "birthDate": "1999-04-05T00:00:00.000Z",
 *   "emailVerified": false,
 *   "marketingOptIn": true,
 *   "status": "active",
 *   "failedAttempts": 0,
 *   "lockedUntil": null
 *  }
 * ]
 */
export const getUsers = async (_req: Request, res: Response): Promise<Response> => {

    try {

        // Solicita la información al servicio.
        const users = await userService.findAll();

        // Retorna la colección de usuarios.
        return res.status(200).json(users);

    } catch (error: any) {

        return res.status(500).json({
            error: error.message
        });

    }

};

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
                error: "El email y la contraseña son obligatorios."
            });
        }

        const user = await userService.findOne(email);

        const validation = await AuthUser.login(user, password);

        return res.status(200).json(validation);

    } catch (error: any) {
        return res.status(401).json({
            error: error.message
        });
    }
};

/**
 * 
 * @param {Request} req 
 * Obtiene la petición HTTP
 * 
 * @param {Response} res 
 * @returns 
 */
export const updateUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email } = req.params;
        const dto: Partial<CreateUserDto> = req.body;

        if (!email) {
            return res.status(400).json({
                error: "El email es obligatorio."
            });
        }

        const user = await userService.update(String(email), dto);

        if (!user) {
            return res.status(404).json({
                error: "Usuario no encontrado."
            });
        }

        return res.status(200).json(user);

    } catch (error: any) {
        return res.status(500).json({
            error: error.message
        });
    }
};

export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({
                error: "El email es obligatorio."
            });
        }
        const deleted = await userService.delete(String(email));

        if (!deleted) {
            return res.status(404).json({
                error: "Usuario no encontrado."
            });
        }

        return res.status(200).json({
            message: "Usuario eliminado correctamente.",
            email: String(email)
        });

    } catch (error: any) {
        return res.status(500).json({
            error: error.message
        });
    }

}

export const restoreUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { email } = req.params;

        if (!email) {
            return res.status(400).json({
                error: "El email es obligatorio."
            });
        }
        await userService.restore(String(email));

        return res.status(200).json({
            message: "Usuario restaurado correctamente.",
            email: String(email)
        });
    } catch (error: any) {
        return res.status(500).json({
            error: error.message
        });
    }
}