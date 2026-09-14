// app/src/services/interfaces/billboard.service.interface.ts

import { BillboardCardDto } from "../../dto/billboard/billboard-card.dto";
import { BillboardQueryDto } from "../../dto/billboard/billboard-query.dto";

/**
 * Contrato del servicio de cartelera.
 */
export interface IBillboardService {
    getBillboard(params: BillboardQueryDto): Promise<BillboardCardDto[]>;
}
