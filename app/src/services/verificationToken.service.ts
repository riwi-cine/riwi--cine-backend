import ActivationToken from "../models/activation-token.model";
import { IEmailVerification } from "./interfaces/email-verification.interface";

export class VerificationTokenService {
    public static async create(data: {
        userId: string | number;
        token: string;
        expiresAt: Date;
    }): Promise<IEmailVerification> {
        const record = await ActivationToken.create({
            userId: Number(data.userId),
            token: data.token,
            expiresAt: data.expiresAt,
        });

        return record.get({ plain: true }) as IEmailVerification;
    }

    public static async findByToken(token: string): Promise<IEmailVerification | null> {
        const record = await ActivationToken.findOne({ where: { token } });

        return record ? (record.get({ plain: true }) as IEmailVerification) : null;
    }

    public static async delete(id: number | string): Promise<void> {
        await ActivationToken.destroy({ where: { id: Number(id) } });
    }

    public static async deleteByUserId(userId: string | number): Promise<void> {
        await ActivationToken.destroy({ where: { userId: Number(userId) } });
    }
}
