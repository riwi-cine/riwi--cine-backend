# HU-009 — Selección de Función y Formato de Proyección

## Descripción

Se implementó la lógica necesaria para consultar, seleccionar y gestionar funciones cinematográficas, respetando las reglas de negocio definidas para la HU-009.

La funcionalidad permite obtener las funciones futuras de una película, consultar el detalle de una función específica, consultar su precio y administrar las funciones mediante operaciones CRUD.

---

## Repository — `FunctionRepository`

### `findFutureFunctions()`

Se implementó la consulta de funciones futuras asociadas a una película.

El método recibe:

```ts
movieId: number
cityId?: number
```

Aplica los siguientes filtros:

- La función pertenece a la película indicada.
- La función está activa.
- La función todavía no ha iniciado.
- Opcionalmente, permite filtrar por ciudad.
- Las funciones se ordenan por fecha/hora de inicio ascendente.

La consulta incluye información relacionada de tipo de función, sala, tipo de sala, cine, ciudad, lanzamiento y película.

También se calculan `ticketsCount` y `seatLocksCount`.

El resultado corresponde a:

```ts
Promise<FunctionDetail[]>
```

### `findOne()`

Se modificó `findOne()` para que solamente permita obtener funciones que puedan ser seleccionadas.

Actualmente aplica:

```ts
active: true,
startsAt: {
    [Op.gt]: new Date(),
}
```

Por lo tanto:

- Una función inactiva no se devuelve.
- Una función que ya inició no se devuelve.
- Una función inexistente no se devuelve.
- Una función activa y futura sí se devuelve.

El método retorna:

```ts
Promise<FunctionDetail | null>
```

Además obtiene información de tipo de función, sala, tipo de sala, cine, ciudad, lanzamiento, película, tickets vendidos, bloqueos de sillas e `isSoldOut`.

La respuesta se instancia primero en:

```ts
const functionDetail: FunctionDetail = {
    // ...
};
```

y posteriormente se retorna:

```ts
return functionDetail;
```

Esto permite validar mediante TypeScript que el objeto cumple con `FunctionDetail`.

### `getPrices()`

Se agregó el método `getPrices()` al Repository para centralizar la obtención y cálculo del precio de una función.

El cálculo utiliza:

```text
Precio final = Precio base + Recargo de la sala
```

El resultado contiene:

```ts
{
    functionId,
    basePrice,
    roomExtraPrice,
    finalPrice
}
```

El método retorna:

```ts
Promise<FunctionPriceDetail | null>
```

### CRUD de `Function`

Se completaron las operaciones generales del Repository:

```text
create()
findAll()
findOne()
update()
delete()
restore()
```

`delete()` utiliza **soft-delete**, mientras que `restore()` permite recuperar una función previamente eliminada.

---

## `FunctionDetail`

Se estableció una estructura de respuesta común para diferentes funcionalidades del sistema.

```text
FunctionDetail

├── id
├── startsAt
├── basePrice
├── active
├── functionType
│   ├── id
│   ├── name
│   ├── projection
│   └── language
├── room
│   ├── id
│   ├── name
│   ├── capacity
│   ├── extraPrice
│   ├── roomType
│   └── cinema
│       └── city
├── movieRelease
│   └── movie
├── ticketsCount
├── seatLocksCount
└── isSoldOut
```

La estructura podrá ser reutilizada en cartelera, detalle de película, carrito y selección de función.

---

## Service — `FunctionService`

Se incorporaron los métodos necesarios para exponer la funcionalidad del Repository:

```text
create()
findAll()
findOne()
findFutureFunctions()
getPrice()
update()
delete()
restore()
```

### `findFutureFunctions()`

El Service verifica previamente que la película exista antes de consultar sus funciones.

Posteriormente consulta las funciones futuras y determina `isSoldOut` utilizando la capacidad de la sala y la cantidad de tickets vendidos.

### `getPrice()`

El Service delega la obtención del precio al Repository:

```ts
async getPrice(id: number): Promise<FunctionPriceDetail | null> {
    return await repository.getPrices(id);
}
```

De esta manera, el cálculo del precio no queda dentro del Controller.

---

## Controller

Se implementaron los controllers necesarios para las operaciones de consulta y administración de funciones.

### Funciones futuras

```http
GET /movies/:id/functions
```

Permite obtener las funciones futuras de una película y admite opcionalmente:

```text
cityId
```

Ejemplos:

```http
GET /movies/10/functions
GET /movies/10/functions?cityId=3
```

### Detalle de una función

```http
GET /functions/:id
```

Obtiene el detalle de una función específica.

Solamente se devuelven funciones que cumplan:

```text
active = true
startsAt > fecha/hora actual
```

### Precio de una función

```http
GET /functions/:id/prices
```

Obtiene el precio de una función.

Ejemplo de respuesta:

```json
{
    "functionId": 15,
    "basePrice": 15000,
    "roomExtraPrice": 3000,
    "finalPrice": 18000
}
```

---

## CRUD de funciones

Además de los endpoints requeridos específicamente por la HU-009, se completó el CRUD general de `Function`.

### Crear función

```http
POST /functions
```

### Obtener todas las funciones

```http
GET /functions
```

### Actualizar función

```http
PUT /functions/:id
```

### Eliminar función

```http
DELETE /functions/:id
```

Realiza la eliminación lógica mediante **soft-delete**.

### Restaurar función

```http
PATCH /functions/:id/restore
```

Permite restaurar una función previamente eliminada.

---

## Endpoints finales

```text
GET    /functions
GET    /functions/:id
GET    /functions/:id/prices
POST   /functions
PUT    /functions/:id
DELETE /functions/:id
PATCH  /functions/:id/restore
```

Consulta de funciones asociadas a una película:

```text
GET /movies/:id/functions
```

---

## Swagger

Se actualizó la documentación Swagger de los endpoints de `Function`.

Se agregaron y corrigieron:

- Parámetros `id` como `path parameters`.
- Descripción de los endpoints.
- Respuestas `200`, `400`, `404` y `500`.
- Estructura de `FunctionDetail`.
- Estructura de respuesta de precios.
- Documentación de las operaciones CRUD.
- Tags correspondientes a `Functions`.

También se corrigió la documentación Swagger de otros endpoints del proyecto, incluyendo **Billboard**, para mantener la documentación consistente con las rutas y respuestas reales de la API.

---

## Refactorización de `Movie`

Se realizó una refactorización de parte de la lógica relacionada con las funciones cinematográficas que anteriormente se encontraba dentro de `Movie`.

Esta lógica fue trasladada hacia:

```text
Function
FunctionRepository
FunctionService
```

El objetivo fue mejorar la separación de responsabilidades y evitar que `Movie` gestione directamente información perteneciente a las funciones de proyección.

La responsabilidad queda distribuida de la siguiente manera:

```text
Movie
│
└── Información propia de la película

Function
│
├── Fecha y hora de proyección
├── Sala
├── Tipo de función
├── Precio
├── Disponibilidad
└── Selección de función
```

---

## Reglas de negocio cubiertas

### RN-035 — No seleccionar funciones ya iniciadas

Implementada mediante:

```ts
startsAt: {
    [Op.gt]: new Date(),
}
```

### RN-036 — Solo mostrar funciones activas

Implementada mediante:

```ts
active: true
```

### RN-037 — Precio variable

Se implementó el cálculo del precio considerando:

```text
Precio base
+
Recargo de sala
=
Precio final
```

Además, `FunctionDetail` contiene la información necesaria del tipo de función y sala.

### RN-038 — Recalcular promociones

La información de la función queda disponible para que las capas superiores puedan realizar el cálculo correspondiente de promociones.

---

## Flujo de funciones futuras

```text
GET /movies/:id/functions
            │
            ▼
getUpcomingFunctions()
            │
            ▼
functionService.findFutureFunctions()
            │
            ▼
FunctionRepository.findFutureFunctions()
            │
            ├── película
            ├── active = true
            ├── startsAt > ahora
            ├── ciudad (opcional)
            ├── sala
            ├── formato
            └── disponibilidad
            │
            ▼
      FunctionDetail[]
```

---

## Flujo de detalle de una función

```text
GET /functions/:id
            │
            ▼
getFunctionById()
            │
            ▼
functionService.findOne()
            │
            ▼
FunctionRepository.findOne()
            │
            ├── active = true
            └── startsAt > ahora
            │
            ▼
      FunctionDetail
```

---

## Flujo de consulta de precio

```text
GET /functions/:id/prices
            │
            ▼
getFunctionFinalPrice()
            │
            ▼
functionService.getPrice()
            │
            ▼
FunctionRepository.getPrices()
            │
            ├── basePrice
            ├── roomExtraPrice
            │
            ▼
        finalPrice
```

---

## Estado actual

La implementación de la HU-009 queda preparada con:

- Consulta de funciones futuras.
- Filtro opcional por ciudad.
- Consulta de una función específica.
- Validación de funciones activas.
- Validación de funciones no iniciadas.
- Información completa de sala, cine, ciudad y formato.
- Conteo de tickets.
- Conteo de bloqueos de sillas.
- Cálculo de `isSoldOut`.
- Consulta del precio de una función.
- Cálculo del precio final considerando el recargo de la sala.
- CRUD completo de funciones.
- Eliminación mediante soft-delete.
- Restauración de funciones.
- Documentación Swagger actualizada.
- Corrección de documentación Swagger en otros endpoints, incluyendo Billboard.
- Refactorización de lógica relacionada con funciones que anteriormente se encontraba dentro de `Movie`.
- Reutilización de `FunctionDetail` como estructura común para diferentes módulos del sistema.
