import { CreateFunctionTypeDto } from "../../dto/create-function-type.dto";
import FunctionType from "../../models/function-type.model";

/**
 * Contrato servicio de FunctionType.
 */
export interface IfunctionTypeService {
  create(dto: CreateFunctionTypeDto): Promise<FunctionType>;

  findAll(): Promise<FunctionType[]>;

  findOne(
    id: number,
    dto?: Partial<CreateFunctionTypeDto>,
  ): Promise<FunctionType | null>;

  update(
    id: number,
    dto: Partial<CreateFunctionTypeDto>,
  ): Promise<FunctionType | null>;

  delete(id: number): Promise<Boolean>;

  restore(id: number): Promise<void>;
}
