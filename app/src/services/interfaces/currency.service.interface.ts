// app/src/repositories/currency.repository.ts

import { CreateCurrencyDto } from "../../dto/create-currency.dto";  
import Currency from "../../models/currency.model";

/**
 * Contrato del Servicio de Monedas.
 */
export interface ICurrencyService {
    create(dto: CreateCurrencyDto): Promise<Currency>;

    findAll(): Promise<Currency[]>;

    findOne(code: string, dto?: Partial<CreateCurrencyDto>): Promise<Currency | null>;

    update(code: string, dto: Partial<CreateCurrencyDto>): Promise<Currency | null>;

    delete(code: string): Promise<Boolean>;

    restore(code: string): Promise<void>;
}