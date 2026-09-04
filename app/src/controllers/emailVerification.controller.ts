import crypto from "crypto";
import { Request, Response } from "express";
import User from "../models/user.model";
import { EmailService } from "../services/email.service";
import { VerificationTokenService } from "../services/verificationToken.service";

export class EmailVerificationController {
    public static async generateAndSendToken(userId: string | number, email: string): Promise<boolean> {
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

        try {
            await VerificationTokenService.deleteByUserId(userId);
            await VerificationTokenService.create({ userId, token, expiresAt });
            await EmailService.sendVerificationEmail(email, token);
            return true;
        } catch (error) {
            console.warn(
                "No se pudo enviar el correo de verificación. El token fue guardado, pero el email no fue entregado.",
                error,
            );
            return false;
        }
    }

    public static async verifyEmail(req: Request, res: Response): Promise<Response> {
        try {
            const { token } = req.query;

            if (!token || typeof token !== "string") {
                return res.status(400).json({ message: "Token de verificación no proporcionado o inválido." });
            }

            const tokenRecord = await VerificationTokenService.findByToken(token);

            if (!tokenRecord) {
                return res.status(400).json({ message: "El token es inválido o ya fue utilizado." });
            }

            if (new Date() > new Date(tokenRecord.expiresAt)) {
                await VerificationTokenService.delete(tokenRecord.id);
                return res.status(400).json({ message: "El token ha expirado. Solicita uno nuevo." });
            }

            const user = await User.findByPk(tokenRecord.userId);

            if (!user) {
                await VerificationTokenService.delete(tokenRecord.id);
                return res.status(404).json({ message: "Usuario no encontrado para este token." });
            }

            await user.update({ emailVerified: true });
            await VerificationTokenService.delete(tokenRecord.id);

            return res.status(200).json({
                message: "Correo verificado con éxito.",
                userId: tokenRecord.userId,
            });
        } catch (error) {
            return res.status(500).json({ message: "Error al verificar el correo", error });
        }
    }

    public static async resendEmail(req: Request, res: Response): Promise<Response> {
        try {
            const { userId, email } = req.body;

            if (!userId || !email) {
                return res.status(400).json({ message: "Se requieren userId y email para reenviar la verificación." });
            }

            const emailSent = await EmailVerificationController.generateAndSendToken(userId, email);

            if (emailSent) {
                return res.status(200).json({
                    message: "Nuevo enlace de confirmación enviado.",
                });
            }

            return res.status(200).json({
                message: "Nuevo enlace de confirmación enviado.",
                warning: "El correo no pudo enviarse en este momento, pero el token sigue disponible para validación.",
            });
        } catch (error) {
            return res.status(500).json({ message: "Error al reenviar el correo de verificación", error });
        }
    }
}
