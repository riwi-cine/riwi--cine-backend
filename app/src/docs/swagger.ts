// app/src/docs/swagger.ts

/**
 * Swagger Configuration
 * ---------------------
 * Este archivo configura la documentación automática de la API
 * utilizando `swagger-jsdoc` y `swagger-ui-express`.
 *
 * - Genera un esquema OpenAPI (3.0.0).
 * - Extrae la documentación de las anotaciones JSDoc ubicadas en `src/routes/*.ts`.
 *
 * Acceso a la documentación:
 *  - La especificación generada es consumida por `swagger-ui-express`.
 *  - Disponible en `/api/docs` (ver `server.ts`).
 */

import swaggerJSDoc from "swagger-jsdoc";
import path from "path";

/**
 * Opciones de configuración para swagger-jsdoc.
 *
 * `definition`:
 *  - Define la versión de OpenAPI.
 *  - Contiene información básica de la API (título, versión, descripción).
 *
 * `apis`:
 *  - Indica la ruta donde se ubican los archivos con anotaciones JSDoc
 *    que describen los endpoints (en este caso, los archivos de rutas).
 */
const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Example",
      version: "1.0.0",
      description:
        "Documentación generada automáticamente con Swagger para la API de ejemplo.",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "local service",
      },
    ],

    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "accesstoken",
          description: "Autenticación basada en JWT almacenado en Cookie HTTP-Only",
        },
      },
    },
  },
  apis: [
    path.join(__dirname, "../routes/*.ts"),
    path.join(__dirname, "../routes/*.js"),
  ],
};
export const swaggerSpec = swaggerJSDoc(options);
