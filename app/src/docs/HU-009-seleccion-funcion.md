# HU-009 — Selección de Función y Formato de Proyección

## Descripción

Se implementó la lógica necesaria para consultar y seleccionar funciones cinematográficas disponibles, respetando las reglas de negocio definidas para la HU-009.

La funcionalidad permite obtener las funciones futuras de una película y consultar el detalle de una función específica que todavía pueda ser seleccionada.

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

También se calculan `ticketsCount`, `seatLocksCount` e `isSoldOut`.

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

---

## `FunctionDetail`

Se estableció una estructura de respuesta común para diferentes funcionalidades del sistema.

Incluye:

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

## Controller

Se implementó el controller `getUpcomingFunctions()` para consultar las funciones futuras de una película.

Endpoint:

```http
GET /movies/:id/functions
```

### Parámetros

Path parameter:

```text
id
```

Identificador de la película.

Query parameter opcional:

```text
cityId
```

Identificador de la ciudad.

Ejemplos:

```http
GET /movies/10/functions
```

```http
GET /movies/10/functions?cityId=3
```

### Validaciones

Se valida que `movieId` y, cuando se proporciona, `cityId` sean números válidos mayores que cero.

Respuestas contempladas:

- `400 Bad Request` para parámetros inválidos.
- `404 Not Found` si la película no existe.
- `500 Internal Server Error` ante errores inesperados.
- `200 OK` cuando la consulta es exitosa.

---

## Endpoint de detalle de función

Se contempla:

```http
GET /functions/{id}
```

Este endpoint utiliza `findOne()` para obtener una función específica.

Debido a las reglas implementadas en Repository, solamente se devolverán funciones que cumplan:

```text
active = true
startsAt > fecha/hora actual
```

Por lo tanto, una función que ya inició no puede ser obtenida mediante esta consulta.

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

`FunctionDetail` conserva `basePrice` e información del formato y de la sala, permitiendo utilizar estos datos para determinar el precio correspondiente.

### RN-038 — Recalcular promociones

La información de la función queda disponible para que las capas superiores realicen el cálculo correspondiente.

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

## Flujo de detalle de una función

```text
GET /functions/:id
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

## Estado actual

La parte de selección y consulta de funciones de la HU-009 queda preparada con:

- Consulta de funciones futuras.
- Filtro opcional por ciudad.
- Consulta de una función específica.
- Validación de funciones activas.
- Validación de funciones no iniciadas.
- Información completa de sala, cine, ciudad y formato.
- Conteo de tickets.
- Conteo de bloqueos de sillas.
- Cálculo de `isSoldOut`.

### Pendiente

Queda pendiente la implementación específica del endpoint:

```http
GET /functions/{id}/prices
```

para completar la parte de cálculo/consulta del precio de la entrada según la función seleccionada.
