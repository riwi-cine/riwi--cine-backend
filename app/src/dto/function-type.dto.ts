/**
 * DTO - Creación de FunctionType
 * ------------------------------
 * Este DTO representa la información necesaria para crear una nueva functionType.
 */


/**
 * 
 */
export interface CreateFunctionTypeDto {

    name: string;

    projection: string;

    language: string;
}