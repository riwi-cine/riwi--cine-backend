export interface IEmailVerificationToken {
    id: number;
    userId: number;
    token: string;
    expiresAt: Date;
    usedAt: Date | null;
    createdAt?: Date;
    updatedAt?: Date;
}

export type IEmailVerification = IEmailVerificationToken;
