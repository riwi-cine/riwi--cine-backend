# Errores reales encontrados

> **Estado: todos corregidos.** Los 5 puntos de abajo ya fueron solucionados en el código. `npx tsc --noEmit` compila sin errores. Se conserva el detalle de cada uno como registro de qué se rompía y por qué.

Revisión de todos los endpoints (controllers, routes, services, repositories, middlewares, models) y los seeders. Solo se listan errores confirmados que rompen funcionalidad o el build — no se incluyen sugerencias de mejora, estilo o refactor.

---

## 1. `PATCH /api/users/`, `DELETE /api/users/` y `POST /api/users/restore` siempre fallan

**Archivos:** `src/routes/user.routes.ts` (líneas 191, 293, 335) y `src/controllers/user.controller.ts` (`updateUser`, `deleteUser`, `restoreUser`)

Las rutas están definidas sin el parámetro `:email`:

```ts
router.patch("/", updateUser);
router.delete("/", deleteUser);
router.post("/restore", restoreUser);
```

Pero los controladores leen `req.params.email`, que nunca existe en esas rutas. Como resultado, **los tres endpoints siempre responden 400** ("El email es obligatorio."), sin importar lo que se envíe. Actualizar, eliminar o restaurar un usuario es imposible actualmente vía la API.

---

## 2. `PATCH /api/functions/:id/update` siempre responde 500 después de guardar el cambio

**Archivo:** `src/repositories/function.repository.ts`, método `update` (línea ~391)

```ts
async update( id: number, data: FunctionCreationAttributes): Promise<Function | null> {
    const cineFunction = await Function.findOne({ where: { id } });
    if (!cineFunction) {
        return null;
    }
    await cineFunction.update(data);
    return await cineFunction.findOne(id);   // <-- bug
}
```

`findOne` es un método **estático** del modelo (`Function.findOne(...)`), no un método de instancia. Llamarlo sobre `cineFunction` (una instancia) lanza en tiempo de ejecución:

```
TypeError: cineFunction.findOne is not a function
```

La actualización sí se guarda en la base de datos (el `.update(data)` anterior se ejecuta bien), pero la petición siempre termina en un 500 porque nunca llega a responder con éxito.

---

## 3. Cualquier actualización de un usuario corrompe su contraseña

**Archivo:** `src/models/user.model.ts`, hooks `beforeUpdate`/`beforeCreate` (líneas ~216-225)

```ts
beforeUpdate: async (user: User) => {
    if (user.passwordHash) {
        user.passwordHash = await hash_password(user.passwordHash);
    }
},
```

El hook `beforeUpdate` de Sequelize se ejecuta en **cada** `.update()` de un usuario, sin importar qué campo se está cambiando. Como `passwordHash` siempre tiene un valor (ya viene cargado desde la BD), la condición `if (user.passwordHash)` es siempre verdadera, y el hook vuelve a hashear el hash ya existente.

Esto significa que operaciones como `POST /api/users/location` (`updateUserLocation`) o cualquier `PATCH` a un usuario **rehashean la contraseña actual sobre sí misma**, dejando al usuario sin poder volver a iniciar sesión con su contraseña real — sin que él la haya cambiado.

---

## 4. El build de producción (`npm run build` / `tsc`) falla: import de DTO inexistente

**Archivo:** `src/services/function-type.service.ts`, línea 4

```ts
import { CreateFunctionTypeDto } from "../dto/function-type.dto";
```

El archivo real es `src/dto/create-function-type.dto.ts`, no `src/dto/function-type.dto.ts`. Confirmado con `npx tsc --noEmit`:

```
src/services/function-type.service.ts(4,39): error TS2307: Cannot find module '../dto/function-type.dto' or its corresponding type declarations.
```

En desarrollo (`npm run dev`, que usa `tsx`) esto no se nota porque el import solo se usa como tipo y se elimina en la transpilación, pero **`npm run build` no compila** con este error.

---

## 5. El build de producción también falla por un segundo error de tipos

**Archivo:** `src/services/user.service.ts`, línea 95

```ts
return await repository.create({
    ...userData,
    countryId,
} as UserCreationAttributes);
```

`tsc` reporta:

```
src/services/user.service.ts(95,40): error TS2352: ... Property 'role' is missing in type ... but required in type 'Omit<UserAttributes, ...>'.
```

El objeto que se castea no incluye `role`, campo requerido por `UserCreationAttributes`. En runtime no causa fallas porque el modelo tiene `defaultValue: "user"` a nivel de base de datos, pero **impide que `tsc` compile el proyecto**, por lo que `npm run build` termina en error igual que el punto 4.

---

## Nota

Ya se corrigió durante esta sesión (no incluido arriba porque dejó de ser un error):

- `src/controllers/auth.controller.ts:63` devolvía `userWithoutPassword` (variable nunca definida) en vez de `withoutpassword`, provocando que **todo login fallara** con `{"error": "userWithoutPassword is not defined"}`.
