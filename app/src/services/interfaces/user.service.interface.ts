// app/src/services/interfaces/user.service.interface.ts

import { CreateUserDto } from "../../dto/create-user.dto";
import User from "../../models/user.model";

/**
 * Contrato del Servicio de Usuarios.
 */

export interface IUserService {
    create(dto: CreateUserDto): Promise<User>;

    findAll(): Promise<User[]>;

    findOne(email: string): Promise<User | null>;

    update(id: number, dto: Partial<CreateUserDto>): Promise<User | null>;

    delete(id: number): Promise<Boolean>;

    restore(id: number): Promise<void>;
}
