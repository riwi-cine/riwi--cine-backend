# HU-010 — Selección Interactiva de Sillas

## Descripción

Se implementó la lógica necesaria para que el usuario visualice el plano de la sala
de una función, bloquee temporalmente las sillas que desea y obtenga el resumen
económico antes de continuar al carrito.

La funcionalidad se apoya en las tablas ya existentes `seats` y `seat_locks`, y se
concentra en cuatro operaciones:

1. `getSeatMap()` — plano de la sala con el estado de cada silla en tiempo real.
2. `lockSeats()` — bloqueo temporal (10 minutos) de las sillas seleccionadas.
3. `releaseSeats()` — liberación manual de las sillas bloqueadas por un carrito.
4. `getReservationSummary()` — total a pagar por las sillas seleccionadas.

Como en la HU-009, todos los endpoints exigen que la función esté **activa** y
**no haya iniciado**.

---

## Arquitectura (vertical slice)

| Capa        | Archivo                                             |
| ----------- | -------------------------------------------------- |
| DTOs        | `src/dto/seat.dto.ts`                              |
| Repository  | `src/repositories/seat.repository.ts` (+ interface) |
| Service     | `src/services/seat.service.ts` (+ interface)        |
| Controller  | `src/controllers/seat.controller.ts`               |
| Rutas       | `src/routes/seat.routes.ts`, `src/routes/reservation.routes.ts` |
| Registro    | `src/server.ts` (`/api/functions`, `/api/reservations`) |
| Seeder      | `src/seeders/seats.seed.ts` (`npm run seed:seats`)  |

---

## Endpoints

### 1. `GET /api/functions/:id/seats`

Plano de la sala de la función. Parámetro opcional `?cartId=` para marcar como
`SELECTED` las sillas que ya bloqueó ese carrito.

Cada silla trae:

- `category`: `STANDARD` | `VIP` | `PREFERENTIAL` | `DISABLED`
- `status`: `AVAILABLE` | `SELECTED` | `LOCKED` | `SOLD` | `DISABLED`
- `lockedUntil`: expiración del bloqueo temporal (o `null`)

```http
GET /api/functions/1/seats?cartId=7
```

### 2. `POST /api/reservations/lock-seats`

Bloquea por 10 minutos (RN-039) las sillas indicadas para un carrito.

```jsonc
// body
{ "functionId": 1, "cartId": 7, "seatIds": [11, 12, 13] }
```

Respuesta: `lockedSeatIds` (bloqueadas), `rejectedSeatIds` (vendidas, inhabilitadas
o tomadas por otro usuario) y `expiresAt`.

- `200` si se bloqueó al menos una silla.
- `409` si ninguna de las sillas seleccionadas está disponible.
- `400` si hay sillas que no pertenecen a la sala o están inhabilitadas.

### 3. `DELETE /api/reservations/release-seats`

Libera las sillas del carrito (RN-040). Si se omite `seatIds`, libera todas las de
esa función.

```jsonc
{ "functionId": 1, "cartId": 7, "seatIds": [13] }
```

### 4. `GET /api/reservations/summary?functionId=&cartId=`

Resumen económico de las sillas bloqueadas por el carrito:
`basePrice`, `roomExtraPrice`, `unitPrice` (= base + recargo de sala), `total`,
`expiresAt` (expiración más próxima) y el detalle por silla en `lines`.

---

## Reglas de negocio aplicadas

| Regla  | Implementación                                                                        |
| ------ | ----------------------------------------------------------------------------------- |
| RN-039 | El bloqueo se crea con `expiresAt = now + 10 min`.                                   |
| RN-040 | `getSeatMap` ignora los bloqueos ya expirados; `lockSeats` los borra antes de evaluar; `release-seats` los elimina. |
| RN-041 | `lockSeats` rechaza sillas vendidas, inhabilitadas o bloqueadas por otro carrito.    |
| RN-042 | Las sillas `DISABLED` no se pueden seleccionar (la categoría preferencial sí, la valida el frontend según política del cine). |
| RN-043 | El índice único `(function_id, seat_id)` de `seat_locks` + `INSERT ... ON CONFLICT DO NOTHING` impiden que dos carritos bloqueen la misma silla en una carrera. |

> Nota: el máximo de sillas por reserva (`maxSeatsPerReservation`) está fijo en `10`
> en `seat.service.ts` porque todavía no existe una columna de configuración por
> administración.

---

## Datos de prueba (`npm run seed:seats`)

El seeder es idempotente y crea un escenario aislado:

- Cine **"Riwi Cine HU-010"** con la sala **"Sala HU-010"** (40 sillas, filas A-E × 1-8).
- Categorías de silla: fila **A** = `PREFERENTIAL`, fila **D** = `VIP`, resto `STANDARD`.
- Una función **activa y futura** (hoy + 2 días, 19:00), precio base `20000`, recargo de sala `6000`.
- **Bloque de demostración: 10 sillas, 2 por cada estado posible.**

  | Estado      | Sillas   | Cómo se genera                                  |
  | ----------- | -------- | ---------------------------------------------- |
  | `AVAILABLE` | B1, B2   | sin bloqueo ni ticket                           |
  | `SELECTED`  | B3, B4   | bloqueadas por el **carrito de pruebas** (se ven `SELECTED` al consultar con su `cartId`, `LOCKED` sin él) |
  | `LOCKED`    | B5, B6   | bloqueadas por el carrito de **"otro usuario"** |
  | `SOLD`      | B7, B8   | ticket vendido                                  |
  | `DISABLED`  | C1, C2   | `seat_type = DISABLED`                          |

- Dos carritos: el de **"otro usuario"** (genera las `LOCKED`) y el **de pruebas** (genera las `SELECTED` y sirve como `cartId` para probar `lock-seats`).
- En cada ejecución se reinician los bloqueos y tickets de esas sillas, de modo que el bloque siempre queda exacto (2 por estado).

Al finalizar imprime `functionId`, `roomId`, los `cartId`, los ids de silla por estado y ejemplos `curl` listos para copiar.
