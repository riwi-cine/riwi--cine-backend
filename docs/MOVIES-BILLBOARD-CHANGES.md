# Cambios y documentación — Movies & Billboard

**Resumen**

- **Cambios principales**: consolidación de rutas y controladores de películas para evitar duplicación y errores 404.
- **Archivo creado**: `docs/MOVIES-BILLBOARD-CHANGES.md` (este documento).

**Archivos modificados**

- **server**: [app/src/server.ts](app/src/server.ts) — ahora usa un único router consolidado `movies.routes`.
- **routes**: [app/src/routes/movies.routes.ts](app/src/routes/movies.routes.ts) — contiene todas las rutas públicas y de detalle para películas (catálogo, filtros, cartelera, detalle, funciones, recomendaciones) y anotaciones Swagger.
- **controllers**: [app/src/controllers/movies.controller.ts](app/src/controllers/movies.controller.ts) — ahora incluye la lógica de listados (billboard) y detalle/funciones/recomendaciones.
- **docs**: [app/src/docs/swagger.ts](app/src/docs/swagger.ts) — ajuste de `servers.url` para evitar duplicar `/api` en las peticiones generadas por Swagger UI.

**Archivos eliminados**

- `app/src/routes/movie.routes.ts` (duplicado; sus rutas movidas a `movies.routes.ts`).
- `app/src/controllers/movie.controller.ts` (duplicado; sus funciones movidas a `movies.controller.ts`).

**Por qué ocurría el error 404 en `GET /api/movies`**

- Había dos causas principales:
    - El router que definía la ruta raíz del catálogo (`GET /`) estaba en `movies.routes.ts`, pero el servidor originalmente sólo montaba `movie.routes` (rutas de detalle con `/:id`). Por tanto no existía un manejador para `/api/movies`.
    - La configuración de Swagger (`servers.url`) apuntaba a `http://localhost:3000/api`, mientras que las rutas documentadas ya incluyen el prefijo `/api` (p. ej. `@swagger /api/movies`). Esto provocaba que Swagger UI intentara llamar a `http://localhost:3000/api/api/movies` (doble `/api`) y devolviera 404 _Undocumented_.
- Solución aplicada: monté el router correcto bajo `/api/movies` y normalicé `servers.url` a `http://localhost:3000`.

**Cómo funciona cada endpoint (Movies & Billboard)**

**GET /api/movies**

- **Descripción**: Obtener catálogo general de películas (no incluye funciones ni salas).
- **Parámetros**: ninguno.
- **Respuesta**: 200 OK con array de tarjetas de película (schema `BillboardCard`).
- **Ejemplo**:
    ```bash
    curl -i http://localhost:3000/api/movies
    ```

**GET /api/movies/weekly**

- **Descripción**: Obtener cartelera semanal por ciudad.
- **Query params**:
    - `cityId` (integer, requerido): ID de la ciudad.
- **Respuesta**: 200 OK con array de `BillboardCard` (7 días fijos desde hoy), 400 en caso de `cityId` inválido.

**GET /api/movies/today**

- **Descripción**: Obtener cartelera del día actual por ciudad.
- **Query params**:
    - `cityId` (integer, requerido)
- **Respuesta**: 200 OK con `BillboardCard` que contiene schedules solo con las funciones de hoy.

**GET /api/movies/filter**

- **Descripción**: Filtrar cartelera por múltiples criterios.
- **Query params**:
    - `cityId` (integer, requerido)
    - `date` (string, opcional, formato `YYYY-MM-DD`)
    - `genre` (string, opcional)
    - `classification` (string, opcional)
    - `language` (string, opcional)
    - `roomType` (string, opcional)
    - `format` (string, opcional)
    - `cinemaId` (integer, opcional)
    - `availableOnly` (boolean, opcional)
- **Respuesta**: 200 OK con cartelera filtrada, 400 en caso de parámetros inválidos.

**GET /api/movies/{id}**

- **Descripción**: Obtener detalle completo de una película.
- **Path params**:
    - `id` (integer, requerido)
- **Respuesta**: 200 OK con el objeto de detalle; 400 si `id` inválido; 404 si no existe.

**GET /api/movies/{id}/functions**

- **Descripción**: Obtener funciones futuras de una película.
- **Path params**: `id` (integer, requerido)
- **Query params**: `cityId` (integer, opcional) — si se pasa, filtra funciones por ciudad.
- **Respuesta**: 200 OK lista de funciones; 400 en caso de parámetros inválidos; 404 si la película no existe.

**GET /api/movies/{id}/recommendations**

- **Descripción**: Obtener recomendaciones relacionadas a una película.
- **Path params**: `id` (integer, requerido)
- **Respuesta**: 200 OK con recomendaciones; 400/404 según corresponda.

**Swagger y documentación automática**

- `app/src/docs/swagger.ts` genera la especificación OpenAPI a partir de las anotaciones JSDoc ubicadas en `app/src/routes/*.ts`.
- `servers.url` está configurado como `http://localhost:3000` para que la UI de Swagger invoque correctamente rutas que empiezan por `/api`.
- Las anotaciones en `movies.routes.ts` incluyen ejemplos y referencias a los schemas (`BillboardCard`, `BillboardSchedule`, `BillboardFunctionSchedule`), de modo que la UI muestre los esquemas esperados.

**Notas de desarrollo y siguientes pasos sugeridos**

- Al compilar (`npm run build`) se detectaron múltiples errores TypeScript en modelos y repositorios (relacionados con tipos Sequelize y métodos disponibles). Estos errores no fueron introducidos por la consolidación; son problemas previos del proyecto que impiden una compilación limpia.
- Recomendaciones:
    - Revisar y actualizar las dependencias de `sequelize` y los tipos (`@types/sequelize` o migrar a `sequelize-typescript`) para que `DataTypes.DATEONLY`, `Sequelize.query`, `Model.findOrCreate`, etc. estén correctamente tipados.
    - Ejecutar pruebas/integración y revisar logs si algún endpoint devuelve datos vacíos o errores 500.

**Comandos útiles para probar**

```bash
# Desde la carpeta app
cd app
npm run dev    # arranca en modo desarrollo (tsx)
npm run build  # transpila TypeScript y valida errores
```

Si quieres, puedo:

- Generar un archivo `ARCHIVE/` con los archivos duplicados en vez de eliminarlos, o
- Empezar a corregir los errores de build (requiere revisar modelos y tipos de Sequelize), o
- Extender la documentación Markdown con ejemplos de respuestas JSON reales (si provees muestras o acceso a un entorno en ejecución).

---

Documento generado automáticamente por cambios solicitados en el proyecto.

## Fix: Asociación Movie ↔ MovieRelease

**Problema identificado**

- Al solicitar el detalle de una película (`GET /api/movies/{id}`) la API devolvía un error 500 con el mensaje: `MovieRelease is not associated to Movie!`.

**Causa**

- El archivo de asociaciones (`app/src/models/associations.ts`) no definía la relación directa entre `Movie` y `MovieRelease`. Por ello, cuando el repositorio intentaba incluir `releases` al cargar un `Movie`, Sequelize lanzaba el error.

**Cambio aplicado**

- Añadida la asociación en `app/src/models/associations.ts`:

```ts
// Movie ---> MovieRelease
Movie.hasMany(MovieRelease, {
    foreignKey: "movieId",
    as: "releases",
});

MovieRelease.belongsTo(Movie, {
    foreignKey: "movieId",
    as: "movie",
});
```

**Archivo modificado**

- [app/src/models/associations.ts](app/src/models/associations.ts)

**Verificación**

- Tras aplicar el cambio, se probó en desarrollo:

```bash
cd app
curl -i http://localhost:3000/api/movies/1
```

- Resultado: `200 OK` y el objeto de película incluye la propiedad `releases` con la fecha de estreno.

**Notas finales**

- Este arreglo corrige el error 500 específico. La compilación TypeScript (`npm run build`) aún muestra otros errores en modelos/repositorios que no están relacionados con esta asociación y pueden requerir una actualización de tipos o dependencias.
