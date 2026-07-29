// app/src/services/interfaces/user.service.interface.ts

import { CreateUserDto } from "../../dto/create-user.dto";
import User from "../../models/user.model";

/**
 * Contrato del Servicio de Usuarios.
 */

export interface IUserService {
    create(dto: CreateUserDto): Promise<User>;

    findAll(): Promise<User[]>;

    findOne(email: string, passwordPlain: string): Promise<User | null>;
}
