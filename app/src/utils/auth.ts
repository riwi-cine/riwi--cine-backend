import bcrypt from 'bcrypt';
import { hash } from 'crypto';

const SALT_ROUNDS = 10;

export const hash_password = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, SALT_ROUNDS);
};

export const compare_password = async (password: string, hashed_password: string): Promise<boolean> => {
    return bcrypt.compare(password, hashed_password);
};