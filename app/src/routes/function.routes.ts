import { Router } from "express";
import { 
    getFunctionById,
    getFunctionFinalPrice,
    createFunction,
    updateFunction,
    deleteFunction,
    restoreFunction
} from "../controllers/function.controller";

const router = Router();

/**
 * GET /:id
 * -------
 * Obtiene el detalle de una función de cine.
 *
 * @swagger
 * /api/functions/{id}:
 *   get:
 *     summary: Obtener el detalle de una función
 *     description: Obtiene una función activa y futura junto con la información de su tipo, sala, cine, ciudad, película y disponibilidad.
 *     tags: [Functions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID de la función
 *         schema:
 *           type: integer
 *           minimum: 1
 *         example: 15
 *     responses:
 *       200:
 *         description: Función encontrada exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 15
 *                 startsAt:
 *                   type: string
 *                   format: date-time
 *                   example: "2026-08-30T19:30:00.000Z"
 *                 basePrice:
 *                   type: number
 *                   format: float
 *                   example: 15000
 *                 active:
 *                   type: boolean
 *                   example: true
 *                 functionType:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     name:
 *                       type: string
 *                       example: "2D Doblada"
 *                     projection:
 *                       type: string
 *                       example: "2D"
 *                     language:
 *                       type: string
 *                       example: "Español"
 *                 room:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 3
 *                     name:
 *                       type: string
 *                       example: "Sala 3"
 *                     capacity:
 *                       type: integer
 *                       example: 120
 *                     extraPrice:
 *                       type: number
 *                       format: float
 *                       example: 3000
 *                     roomType:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 2
 *                         name:
 *                           type: string
 *                           example: "VIP"
 *                         description:
 *                           type: string
 *                           example: "Sala con asientos reclinables"
 *                     cinema:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         name:
 *                           type: string
 *                           example: "Cine Colombia"
 *                         address:
 *                           type: string
 *                           example: "Calle 72 # 54-20"
 *                         city:
 *                           type: object
 *                           nullable: true
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             name:
 *                               type: string
 *                               example: "Barranquilla"
 *                 movieRelease:
 *                   type: object
 *                   nullable: true
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 10
 *                     releaseDate:
 *                       type: string
 *                       format: date
 *                       example: "2026-08-20"
 *                     countryId:
 *                       type: integer
 *                       example: 1
 *                     movie:
 *                       type: object
 *                       nullable: true
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 25
 *                         title:
 *                           type: string
 *                           example: "Avengers: Secret Wars"
 *                 ticketsCount:
 *                   type: integer
 *                   example: 80
 *                 seatLocksCount:
 *                   type: integer
 *                   example: 5
 *                 isSoldOut:
 *                   type: boolean
 *                   nullable: true
 *                   example: false
 *       400:
 *         description: El ID proporcionado no es válido.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "El id de la función debe ser un número válido."
 *       404:
 *         description: Función no encontrada, inactiva o ya iniciada.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Función no encontrada."
 *       500:
 *         description: Error interno del servidor.
 */
router.get("/:id", getFunctionById);

export default router;