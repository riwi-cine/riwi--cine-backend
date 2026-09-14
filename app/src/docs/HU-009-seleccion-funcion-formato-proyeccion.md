# HU-009 — Selección de Función y Formato de Proyección

## Descripción

Se implementó y refactorizó la lógica necesaria para la selección de funciones cinematográficas de la HU-009.

La funcionalidad principal se concentra en tres consultas:

1. `findFutureFunctions()` — obtener las funciones disponibles de una película.
2. `getFunctionById()` — obtener el detalle de una función específica disponible.
3. `getPrices()` — obtener el precio de una función.

Para las consultas relacionadas con la selección de funciones se estableció como condición principal que la función:

- Esté **activa**.
- **No haya iniciado** todavía.

De esta manera, las funciones que ya comenzaron o que se encuentran inactivas no pueden ser seleccionadas mediante estos endpoints.

Además, se completó el CRUD de `Function`, el CRUD de `FunctionType`, se actualizaron diferentes definiciones Swagger y se realizó una refactorización importante de la lógica de funciones que anteriormente pertenecía a `Movie`.

---

# Funcionalidades principales de la HU-009

## 1. `findFutureFunctions()`

Obtiene las funciones futuras disponibles para una película.

Endpoint:

```http
GET /movies/:id/functions
```

Recibe el identificador de la película mediante el parámetro:

```text
id
```

También permite filtrar opcionalmente por ciudad:

```text
cityId
```

Ejemplos:

```http
GET /movies/10/functions
```

```http
GET /movies/10/functions?cityId=3
```

### Condiciones de búsqueda

La consulta solamente obtiene funciones que cumplan:

```ts
movieId = movieId recibido

active = true

startsAt > new Date()
```

Por lo tanto:

```text
Función activa + todavía no iniciada
                ↓
        Función seleccionable
```

Mientras que:

```text
Función inactiva
       ↓
   No se muestra
```

y:

```text
Función ya iniciada
       ↓
   No se muestra
```

### Información obtenida

La consulta incluye:

- Tipo de función.
- Formato de proyección.
- Idioma.
- Sala.
- Tipo de sala.
- Capacidad.
- Recargo de sala.
- Cine.
- Ciudad.
- Información de lanzamiento.
- Película.
- Cantidad de tickets vendidos.
- Cantidad de bloqueos de sillas.
- Estado de disponibilidad mediante `isSoldOut`.

El resultado corresponde a:

```ts
Promise<FunctionDetail[]>
```

---

# 2. `getFunctionById()`

Permite obtener el detalle de una función específica.

Endpoint:

```http
GET /functions/:id
```

El `id` corresponde al identificador de la función.

La consulta en Repository aplica:

```ts
active: true,
startsAt: {
    [Op.gt]: new Date(),
}
```

Por lo tanto, el endpoint **no devuelve cualquier función existente**, sino únicamente una función:

- Existente.
- Activa.
- Que todavía no haya iniciado.

Esto permite utilizar directamente este endpoint para seleccionar una función dentro del proceso de compra.

El resultado corresponde a:

```ts
Promise<FunctionDetail | null>
```

---

# 3. `getPrices()`

Permite consultar el precio de una función disponible.

Endpoint:

```http
GET /functions/:id/prices
```

El precio se obtiene a partir de:

```text
Precio base
+
Recargo de la sala
=
Precio final
```

La respuesta contiene:

```json
{
    "functionId": 15,
    "basePrice": 15000,
    "roomExtraPrice": 3000,
    "finalPrice": 18000
}
```

El cálculo se trasladó al Repository para mantener la separación de responsabilidades.

El Service solamente delega la operación:

```ts
async getPrice(id: number): Promise<FunctionPriceDetail | null> {
    return await repository.getPrices(id);
}
```

---

# Repository — `FunctionRepository`

## `findFutureFunctions()`

Se trasladó la responsabilidad de consultar las funciones futuras al Repository de `Function`.

El método recibe:

```ts
movieId: number
cityId?: number
```

Aplica:

```ts
movieId,
active: true,
startsAt: {
    [Op.gt]: new Date(),
}
```

Las funciones se ordenan por:

```ts
order: [["startsAt", "ASC"]]
```

También se incluyen las relaciones necesarias para construir `FunctionDetail`.

Se calculan:

```text
ticketsCount
seatLocksCount
```

y posteriormente se determina la disponibilidad de la función mediante `isSoldOut`.

---

## `findOne()`

Se modificó para que el detalle de una función solamente pueda obtenerse cuando esta sea seleccionable.

La condición es:

```ts
active: true,
startsAt: {
    [Op.gt]: new Date(),
}
```

La respuesta se instancia primero:

```ts
const functionDetail: FunctionDetail = {
    // ...
};
```

y luego:

```ts
return functionDetail;
```

Esto permite validar mediante TypeScript que la respuesta cumple con la estructura `FunctionDetail`.

---

## `getPrices()`

Se agregó al Repository para centralizar la lógica de cálculo del precio.

La información utilizada es:

```text
basePrice
room.extraPrice
```

Y el resultado:

```text
finalPrice = basePrice + roomExtraPrice
```

---

# `FunctionDetail`

Se estableció una estructura común para representar el detalle de una función:

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

Esta estructura puede ser reutilizada por:

- Selección de funciones.
- Cartelera.
- Detalle de película.
- Carrito.
- Compra de entradas.

---

# Refactorización principal

## Movimiento de `findFutureFunctions` desde `Movie` hacia `Function`

La refactorización principal realizada durante esta implementación fue trasladar la lógica de búsqueda de funciones futuras que anteriormente se encontraba dentro de `Movie`.

Anteriormente, la lógica relacionada con las funciones estaba acoplada a la entidad `Movie`.

Se reorganizó para que la responsabilidad pertenezca a `Function`:

```text
Antes:

Movie
 └── findFutureFunctions()

Después:

Function
 ├── FunctionRepository
 │    └── findFutureFunctions()
 │
 └── FunctionService
      └── findFutureFunctions()
```

Esto permite que `Movie` se encargue principalmente de la información propia de la película, mientras que `Function` maneja la información relacionada con sus proyecciones.

La responsabilidad queda mejor separada:

```text
Movie
└── Información de la película

Function
├── Fecha y hora
├── Sala
├── Cine
├── Tipo de función
├── Precio
├── Disponibilidad
└── Selección de función
```

Este cambio también permite reutilizar `findFutureFunctions()` desde diferentes partes del sistema sin depender de la lógica interna de `Movie`.

---

# Service — `FunctionService`

Se implementaron los métodos correspondientes:

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

## `findFutureFunctions()`

Antes de consultar las funciones se verifica que la película exista:

```ts
const movie = await movieRepository.findDetailById(movieId);

if (!movie) {
    throw new Error("Película no encontrada.");
}
```

Después se consultan únicamente las funciones:

```text
activas
+
futuras
```

y se determina `isSoldOut`.

---

# Controller

Se implementaron los controllers correspondientes a las funcionalidades principales de HU-009.

## Funciones futuras

```http
GET /movies/:id/functions
```

Controller:

```ts
getUpcomingFunctions()
```

## Detalle de función

```http
GET /functions/:id
```

Controller:

```ts
getFunctionById()
```

## Precio

```http
GET /functions/:id/prices
```

Controller:

```ts
getFunctionFinalPrice()
```

Todos validan que el parámetro `id` sea un número válido y mayor que cero.

---

# CRUD de `Function`

Aunque no forma parte directamente de los tres endpoints principales de selección de HU-009, se completó el CRUD de `Function`.

```text
POST   /functions
GET    /functions
GET    /functions/:id
PUT    /functions/:id
DELETE /functions/:id
PATCH  /functions/:id/restore
```

Se implementaron:

- `create()`
- `findAll()`
- `findOne()`
- `update()`
- `delete()`
- `restore()`

La eliminación utiliza **soft-delete** y `restore()` permite recuperar una función eliminada.

---

# CRUD de `FunctionType`

También se completó el CRUD de `FunctionType`.

Se implementaron las operaciones necesarias para:

```text
Crear
Consultar
Actualizar
Eliminar
Restaurar
```

Esto permite administrar los diferentes tipos de función y sus características, como:

```text
projection
language
name
```

Ejemplos de tipos de función:

```text
2D
3D
IMAX
VIP
```

y sus correspondientes configuraciones de idioma o audio.

---

# Swagger

Se actualizó la documentación Swagger de los endpoints relacionados con `Function` y `FunctionType`.

Se corrigieron principalmente:

- Parámetros `id` como `path parameters`.
- Rutas de los endpoints.
- Descripciones.
- Respuestas HTTP.
- Estructuras de respuesta.
- `FunctionDetail`.
- Respuesta de precios.
- Operaciones CRUD.
- Tags.

También se corrigió Swagger en otros endpoints del proyecto, incluyendo **Billboard**, para que la documentación coincida con las rutas y respuestas reales de la API.

---

# Reglas de negocio cubiertas

## RN-035 — No se podrán seleccionar funciones ya iniciadas

Se implementó mediante:

```ts
startsAt: {
    [Op.gt]: new Date(),
}
```

Una función que ya comenzó no se devuelve mediante las consultas de selección.

---

## RN-036 — Solo se mostrarán funciones activas

Se implementó mediante:

```ts
active: true
```

Las funciones inactivas no se consideran disponibles para selección.

---

## RN-037 — El precio podrá variar según el formato, la sala y el horario

Se implementó la consulta del precio de la función mediante:

```text
basePrice
+
roomExtraPrice
=
finalPrice
```

Además, `FunctionDetail` contiene información sobre:

- Tipo de función.
- Formato.
- Sala.
- Recargo de sala.

Esto permite utilizar estos datos en las capas superiores para realizar los cálculos correspondientes.

---

## RN-038 — Las promociones se recalcularán automáticamente

La información necesaria de la función queda disponible para que las capas correspondientes puedan aplicar las reglas de promociones y recalcular el valor final de la compra.

---

# Flujo principal de selección

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
            ├── movieId
            ├── active = true
            ├── startsAt > ahora
            ├── cityId opcional
            ├── sala
            ├── formato
            └── disponibilidad
            │
            ▼
      FunctionDetail[]
```

---

# Flujo de detalle

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

# Flujo de precio

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

# Estado actual

La implementación queda preparada con las tres funcionalidades principales de HU-009:

### 1. Funciones futuras

```http
GET /movies/:id/functions
```

Obtiene únicamente funciones:

```text
activas
+
no iniciadas
```

### 2. Detalle de función

```http
GET /functions/:id
```

Obtiene únicamente una función:

```text
activa
+
no iniciada
```

### 3. Precio de función

```http
GET /functions/:id/prices
```

Obtiene y calcula el precio correspondiente a la función.

Además:

- CRUD completo de `Function`.
- CRUD completo de `FunctionType`.
- Soft-delete y restore.
- Información de sala, cine, ciudad y formato.
- Conteo de tickets.
- Conteo de bloqueos de sillas.
- Cálculo de `isSoldOut`.
- Documentación Swagger actualizada.
- Correcciones Swagger en Billboard y otros endpoints.
- Refactorización de `findFutureFunctions`, trasladándolo desde `Movie` hacia `Function`.
- Separación de responsabilidades entre `Movie` y `Function`.
- Reutilización de `FunctionDetail` en diferentes capas y funcionalidades del sistema.
