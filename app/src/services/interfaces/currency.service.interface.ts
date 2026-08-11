// app/src/repositories/currency.repository.ts

import { CreateCurrencyDto } from "../../dto/create-currency.dto";  
import Currency from "../../models/currency.model";

/**
 * Contrato del Servicio de Monedas.
 */
export interface ICurrencyService {
    create(dto: CreateCurrencyDto): Promise<Currency>;

    findAll(): Promise<Currency[]>;

    findOne(id: number, dto?: Partial<CreateCurrencyDto>): Promise<Currency | null>;

    update(id: number, dto: Partial<CreateCurrencyDto>): Promise<Currency | null>;

    delete(id: number): Promise<Boolean>;

    restore(id: number): Promise<void>;
}