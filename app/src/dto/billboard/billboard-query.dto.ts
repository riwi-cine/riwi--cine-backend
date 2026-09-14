// app/src/dto/billboard/billboard-query.dto.ts

/**
 * Parámetros admitidos por los endpoints de cartelera.
 *
 * La validación se realiza en controller/service para conservar el estilo
 * actual del proyecto: DTOs planos sin class-validator.
 */
export interface BillboardQueryDto {
    cityId: number;
    date?: string;
    genre?: string;
    classification?: string;
    language?: string;
    roomType?: string;
    format?: string;
    cinemaId?: number;
    availableOnly?: boolean;
}
