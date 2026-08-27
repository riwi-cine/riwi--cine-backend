export interface IEmailVerification {
    id: number;
    userID: number;
    token: string;
    createdAt: Date;
    updateAt: Date;
}