import { EmailVerificationController } from "../controllers/emailVerification.controller";
import { EmailService } from "../services/email.service";
import { VerificationTokenService } from "../services/verificationToken.service";

describe("email verification flow", () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("exposes the verification email API and token helpers", () => {
        expect(typeof EmailService.sendVerificationEmail).toBe("function");
        expect(typeof VerificationTokenService.create).toBe("function");
        expect(typeof EmailVerificationController.generateAndSendToken).toBe("function");
    });

    it("does not include warning when the email is successfully sent", async () => {
        jest.spyOn(VerificationTokenService, "deleteByUserId").mockResolvedValue(undefined as any);
        jest.spyOn(VerificationTokenService, "create").mockResolvedValue({} as any);
        jest.spyOn(EmailService, "sendVerificationEmail").mockResolvedValue(undefined);

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        await EmailVerificationController.resendEmail({ body: { userId: 7, email: "user@example.com" } } as any, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Nuevo enlace de confirmación enviado.",
            }),
        );
        expect(res.json).not.toHaveBeenCalledWith(
            expect.objectContaining({
                warning: expect.any(String),
            }),
        );
    });

    it("includes warning only when the email delivery fails", async () => {
        jest.spyOn(VerificationTokenService, "deleteByUserId").mockResolvedValue(undefined as any);
        jest.spyOn(VerificationTokenService, "create").mockResolvedValue({} as any);
        jest.spyOn(EmailService, "sendVerificationEmail").mockRejectedValue(new Error("SMTP down"));

        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        } as any;

        await EmailVerificationController.resendEmail({ body: { userId: 8, email: "user2@example.com" } } as any, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({
                message: "Nuevo enlace de confirmación enviado.",
                warning: "El correo no pudo enviarse en este momento, pero el token sigue disponible para validación.",
            }),
        );
    });
});
