export interface IEmailVerification {
    id: number;
    userId: number;
    token: string;
    expiresAt: Date;
    usedAt: Date | null;
}