import {transporter} from '../config/mailer'

export class EmailService {
    public static async sendServiceEmail(toEmail: string, token: string): Promise<void> {
        const appUrl = process.env.APP_URL ;
        const confirmUrl = `${appUrl}/api/auth/verify-email?token=${token}`;

        const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #2563eb;">¡Bienvenido a nuestra plataforma!</h2>
            <p>Para completar tu registro y activar tu cuenta, por favor confirma tu correo:</p>
            <div style="text-align: center; margin: 30px 0;">
            <a href="${confirmUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px;
            text-decoration: none; border-radius: 6px;">Confirmar mi correo</a>
            </div>
            <p style="font-size: 12px; color: #64748b;">Este enlace expirará en 15 minutos.</p>
        </div>
    `;

    await transporter.sendMail({
        from: `"Soporte App" <${process.env.SMTP_FROM || 'no-reply@app.com'}>`,
        to: toEmail,
        subject: 'Confirma tu dirección de correo electrónico',
        html: htmlContent,
    })
    }
}