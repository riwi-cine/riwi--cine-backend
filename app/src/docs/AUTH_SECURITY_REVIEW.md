**Resumen de cambios**

- **Se añadieron/modificaron modelos**: [app/src/models/user.model.ts](app/src/models/user.model.ts), [app/src/models/role.model.ts](app/src/models/role.model.ts), [app/src/models/user-role.model.ts](app/src/models/user-role.model.ts), [app/src/models/activation-token.model.ts](app/src/models/activation-token.model.ts), [app/src/models/refresh-token.model.ts](app/src/models/refresh-token.model.ts), [app/src/models/membership.model.ts](app/src/models/membership.model.ts), [app/src/models/audit-log.model.ts](app/src/models/audit-log.model.ts).
- **Hashing y utilidades JWT**: se agregó [app/src/utils/auth.ts](app/src/utils/auth.ts) (bcrypt) y [app/src/utils/jwt.ts](app/src/utils/jwt.ts) (jsonwebtoken).
- **Servicio de auth**: nuevo [app/src/services/auth.service.ts](app/src/services/auth.service.ts) que encapsula comparación y hashing.
- **Repositorio de usuarios**: [app/src/repositories/user.repository.ts](app/src/repositories/user.repository.ts) se actualizó (excluir passwordHash en búsquedas, añadir update/delete/restore, cambiar firma de findOne).
- **Controladores / rutas**: cambios en login y endpoints de usuario: [app/src/controllers/auth.controller.ts](app/src/controllers/auth.controller.ts), [app/src/controllers/user.controller.ts](app/src/controllers/user.controller.ts), [app/src/routes/auth.routes.ts](app/src/routes/auth.routes.ts).
- **Middlewares**: se añadieron/modificaron [app/src/middlewares/auth.middleware.ts](app/src/middlewares/auth.middleware.ts) y [app/src/middlewares/role.middleware.ts](app/src/middlewares/role.middleware.ts). Otros middlewares solicitados (`captcha`, `rateLimit`, `audit`) no existen en `app/src/middlewares`.
- **Asociaciones**: [app/src/models/associations.ts](app/src/models/associations.ts) enlaza `users` ↔ `roles` vía `user_roles`, y define relaciones con `activation_tokens`, `refresh_tokens`, `memberships`.

**1) Cambios por archivo (explicado en lenguaje simple)**

- [app/src/models/user.model.ts](app/src/models/user.model.ts):
    - Se amplió la entidad `User` con campos de perfil (`firstName`, `lastName`, `phone`, `birthDate`, `marketingOptIn`, `countryId`).
    - Se renombró/normalizó el manejo de contraseña a `passwordHash` y se añadió un `hook` (`beforeCreate` / `beforeUpdate`) que aplica `hash_password()` al campo antes de persistir.
    - Se añadieron campos para seguridad: `emailVerified` (boolean), `failedAttempts` (contador), `lockedUntil` (timestamp) y `status`.
    - Se mantiene un campo `role` string por compatibilidad; además se habilitaron `paranoid` (soft-delete) y timestamps.

- [app/src/utils/auth.ts](app/src/utils/auth.ts):
    - Nueva utilidad usando `bcrypt` con SALT_ROUNDS=10.
    - Exporta `hash_password(password)` y `compare_password(password, hashed)`.

- [app/src/utils/jwt.ts](app/src/utils/jwt.ts):
    - Nuevas funciones `generateToken(payload)` y `verifytoken(token)` que usan `jsonwebtoken` y `process.env.JWT_SECRET`.
    - `expiresIn` se toma de `process.env.JWT_EXPIRES_IN`.

- [app/src/models/activation-token.model.ts](app/src/models/activation-token.model.ts):
    - Nuevo modelo que almacena `token`, `userId`, `expiresAt`, `usedAt`.
    - Estructura lista para soportar tokens de activación.

- [app/src/models/refresh-token.model.ts](app/src/models/refresh-token.model.ts):
    - Nuevo modelo que almacena `tokenHash`, `userId`, `expiresAt`, `revokedAt`.
    - Previsto para persistir refresh tokens (hash + revocación).

- [app/src/models/role.model.ts](app/src/models/role.model.ts) y [app/src/models/user-role.model.ts](app/src/models/user-role.model.ts):
    - Nuevos modelos para soportar RBAC relacional (tabla `roles` y tabla pivot `user_roles`).
    - `UserRole` tiene índice único sobre (user_id, role_id).

- [app/src/models/membership.model.ts](app/src/models/membership.model.ts):
    - Nuevo modelo `Membership` con `code`, `level`, `status` y `userId`.

- [app/src/models/refresh-token.model.ts](app/src/models/refresh-token.model.ts) y [app/src/models/audit-log.model.ts](app/src/models/audit-log.model.ts):
    - Modelos añadidos para auditoría y manejo de refresh tokens.

- [app/src/services/auth.service.ts](app/src/services/auth.service.ts):
    - Nuevo servicio `AuthUser` que usa `compare_password` para validar credenciales y `hash_password` para exponer hashing si se necesita.
    - En `login()` lanza Error en caso de contraseña incorrecta.

- [app/src/repositories/user.repository.ts](app/src/repositories/user.repository.ts):
    - `findAll()` ahora excluye `passwordHash` del resultado.
    - `findOne(email)` ahora devuelve solo el usuario por email (la comprobación de contraseña se mueve a `AuthUser.login`).
    - Se añadieron `update`, `delete`, `restore`.

- [app/src/controllers/auth.controller.ts](app/src/controllers/auth.controller.ts):
    - `findUser` (login): recibe `email` y `password`, pide el usuario a `userService.findOne(email)`, valida la contraseña con `AuthUser.login`, genera un JWT con `generateToken({ email })` y lo coloca en una cookie HTTP-only `accesstoken` con `maxAge` 15 minutos; responde con el usuario (sin el `passwordHash`).

- [app/src/middlewares/auth.middleware.ts](app/src/middlewares/auth.middleware.ts):
    - Toma el token de `req.cookies?.accesstoken`, valida con `verifytoken`, establece `req.user = decoded`.
    - En caso de error intenta `res.clearCookie('accessToken')` y devuelve 401 (nota: hay inconsistencia en el nombre de la cookie, ver sección de issues).

- [app/src/middlewares/role.middleware.ts](app/src/middlewares/role.middleware.ts):
    - Expone `roleMiddleware(allowedRoles)` que: recupera `req.user` (set por `authMiddleware`), carga datos del usuario desde DB y permite la petición si `userData.role` está en `allowedRoles` o si `req.params.email` coincide con `userData.email`.
    - Implementación actual usa `user.role` (string) en vez de la relación N:M `user_roles`.

- Archivos solicitados que NO se encontraron / no se modificaron en esta rama:
    - `captcha.middleware`, `rateLimit.middleware`, `audit.middleware` no existen.
    - `config/jwt.js` y `config/env.js` no existen; se usa `process.env` dentro de `app/src/utils/jwt.ts`.
    - `utils/hashPassword.js` se reemplaza por `app/src/utils/auth.ts`.
    - Migraciones/seeders nombrados (`017-create-users.js`, `019-create-roles.js`, `020-create-user-roles.js`, `021-create-activation-tokens.js`, `022-create-refresh-tokens.js`, `006-seed-roles.js`, `007-seed-admin-user.js`) no fueron encontrados en el repositorio.

**2) Flujo de registro y activación (HU-006)**

- Implementación actual:
    - El endpoint de creación llama a `UserController.createUser` → `UserService.create(dto)` → `repository.create(...)`.
    - `User` tiene hooks `beforeCreate` y `beforeUpdate` que llaman a `hash_password()` para almacenar `passwordHash` con `bcrypt`.
    - Se introdujeron modelos de soporte: `ActivationToken` y `Membership`.

- Lo que sí está implementado:
    - Hashing de contraseñas con `bcrypt` (SALT_ROUNDS=10) antes de persistir.
    - Modelos para token de activación y para membresía.
    - Asociación `User.hasMany(ActivationToken)` para relacionar tokens con usuarios.

- Lo que falta / está pendiente (no visto en el código actual):
    - Generación de `ActivationToken` durante el registro (no hay lógica en `UserService.create` ni en `Auth`/`User` services que cree el token y lo envíe por email).
    - Garantizar la transacción combinada registro + creación de `Membership` + generación de activation token: `UserService.create` delega a `repository.create`, pero no orquesta una transacción explícita que cree membership + token dentro de la misma transacción.
    - Validación explícita de la contraseña (fuerza/min-length/complexidad) antes de crear la cuenta: no encontrada.
    - Expiración a 24h del token de activación: el modelo tiene `expiresAt` pero no se observó código que lo calcule a 24 horas ni que invalide tokens fuera de esa ventana.

Conclusión HU-006: el modelo de datos y el hashing están listos; el flujo transaccional de registro+membresía+token y el envío/verificación del token de activación no están implementados en esta rama.

**3) Flujo de login (HU-007)**

- Implementación encontrada:
    - `auth.controller.ts` genera un Access Token usando `generateToken({ email })` y lo guarda en cookie HTTP-only `accesstoken` con `maxAge: 1000*60*15` (15 minutos).
    - `auth.service.ts` y `utils/auth.ts` usan `compare_password` (bcrypt.compare) para validar la contraseña.
    - `RefreshToken` modelo existe (persistencia planeada) con `tokenHash`, `expiresAt` y `revokedAt`.

- Fallos / ausencia en la implementación completa:
    - No se emite ni persiste un Refresh Token en la ruta de login: aunque existe el modelo `RefreshToken`, no hay código que cree el token, lo guarde (hash) o invalide el anterior.
    - Invalidación del refresh token anterior no está implementada (modelo preparado, pero no usado).
    - Bloqueo tras 5 intentos fallidos por 15 minutos: el `User` tiene `failedAttempts` y `lockedUntil`, pero no hay lógica en `AuthUser.login` ni en `auth.controller` que incremente `failedAttempts`, calcule `lockedUntil` tras 5 intentos o bloquee el login si `lockedUntil` > now.
    - Verificación de correo obligatorio: `emailVerified` existe en el modelo, pero `findUser` no comprueba que `emailVerified === true` antes de permitir login.
    - Inconsistencia de expiraciones: el token JWT usaría `process.env.JWT_EXPIRES_IN` (si está definido) mientras la cookie tiene `maxAge` fijo a 15 minutos; esto puede producir desincronía entre expiración del JWT y expiración de la cookie.

Conclusión HU-007: se tiene la base (hashing, modelo refresh token, cookie para access token) pero faltan las piezas críticas: generación/almacenamiento/revocación de refresh tokens, contador de intentos y bloqueo, y verificación obligatoria de correo.

**4) Modelo de roles y RBAC (HU-020)**

- Qué hay en el modelo:
    - Tablas/Modelos añadidos: `Role`, `UserRole` y asociación N:M entre `User` y `Role` ([app/src/models/associations.ts](app/src/models/associations.ts)).
    - `UserRole` tiene índice unique en (user_id, role_id), evitando duplicados.

- Cómo valida el middleware:
    - El middleware `roleMiddleware(allowedRoles)` carga al usuario desde la DB y compara `userData.role` (campo string en el `User`) con `allowedRoles`.
    - Si el usuario tiene alguno de los `allowedRoles` permite la petición; además permite el acceso si el usuario está actuando sobre su propio recurso (`req.params.email === userData.email`).

- Observación crítica:
    - Aunque existe una implementación relacional correcta (N:M), el middleware actual utiliza el campo string `user.role` en el modelo `User`. Esto genera inconsistencia: el diseño soporta múltiples roles por usuario, pero el middleware hace una comprobación simple sobre un rol único en `user.role`.
    - Esto evita checks hardcodeados tipo `if (user.isAdmin)`, y en su lugar usa `allowedRoles.includes(user.role)`, lo cual es mejor, pero no aprovecha la tabla `user_roles` ni el hecho de que un usuario pueda tener varios roles.

- Recomendación rápida:
    - Ajustar `roleMiddleware` para leer `user.getRoles()` o hacer JOIN con `roles` y comprobar si al menos un `role.name` está en `allowedRoles`. Mantener la excepción de propietario (email matching) si procede.

**5) Middlewares de seguridad: qué hace cada uno y orden sugerido**

- `authMiddleware` ([app/src/middlewares/auth.middleware.ts](app/src/middlewares/auth.middleware.ts)):
    - Lee cookie `accesstoken`, verifica JWT con `verifytoken`, setea `req.user = decoded`.
    - Responde 401 si no hay token o si la verificación falla.
    - Issue detectado: en el `catch` hace `res.clearCookie('accessToken')` (nombre distinto), lo que puede dejar la cookie real sin limpiar.

- `roleMiddleware` ([app/src/middlewares/role.middleware.ts](app/src/middlewares/role.middleware.ts)):
    - Comprueba `req.user` y carga datos del usuario desde DB; permite si el `user.role` está en `allowedRoles` o si el recurso es propio.

- `captcha.middleware`:
    - NO existe en la rama. Si se pretende verificar CAPTCHA en registro/login, deberá añadirse y ser colocado antes de la validación de las credenciales.

- `rateLimit.middleware`:
    - NO existe en la rama. Sugerencia: usar `express-rate-limit` para limitar peticiones por IP/endpoint (ej. login) y prevenir brute-force.

- `audit.middleware`:
    - NO existe en la rama. Existe modelo `AuditLog` para persistir registros de acciones, pero no hay middleware que capture y persista la información.

- Orden de ejecución sugerido (por endpoint que toca auth):
    1. `rateLimit` (limitar tasa por IP/usuario)
    2. `captcha` (si aplica, por ejemplo en login/registro)
    3. `auth` (verificar JWT cuando se requiera autenticación)
    4. `rbac` / `roleMiddleware` (comprobar permisos y propietario)
    5. `audit` (registrar la acción: éxito/fracaso, IP, user, entidad afectada)

**6) Paquetes npm usados y cómo se invocan**

| Paquete            |                    Propósito | Uso clave en el código                                                                                                           |
| ------------------ | ---------------------------: | -------------------------------------------------------------------------------------------------------------------------------- |
| `bcrypt`           |  Hash/compare de contraseñas | `bcrypt.hash(password, SALT_ROUNDS)` y `bcrypt.compare(password, hash)` en [app/src/utils/auth.ts](app/src/utils/auth.ts)        |
| `jsonwebtoken`     |         Firmar/verificar JWT | `jwt.sign(payload, JWT_SECRET, { expiresIn })` y `jwt.verify(token, JWT_SECRET)` en [app/src/utils/jwt.ts](app/src/utils/jwt.ts) |
| `cookie-parser`    | Parseo de cookies en Express | requerido en servidor (package.json) y `auth.middleware` lee `req.cookies?.accesstoken` (cookie set en controlador)              |
| `sequelize` + `pg` |        ORM y driver Postgres | Modelos y asociaciones en `app/src/models/*.ts`                                                                                  |
| `express`          |                Framework web | Middlewares/routers/handlers usuales                                                                                             |

Nota: `express-rate-limit` no está en `package.json`; si se requiere rate limiting, agregar dependencia.

**7) Patrones de diseño y arquitectura aplicados**

- Capas separadas: `Controller → Service → Repository → Sequelize` (claro en `user.controller.ts` → `user.service.ts` → `user.repository.ts`).
- Middlewares transversales para autenticar/autorizar y (planeado) auditar y rate-limit.
- JWTs para acceso stateless (`utils/jwt.ts`) y cookies HTTP-only para transporte seguro del access token.
- Modelos normalizados con Sequelize y relaciones N:M para roles (flexible para RBAC).
- Uso de hooks de modelo (`beforeCreate` / `beforeUpdate`) para centralizar hashing de contraseñas.

Razonamiento: separación de responsabilidades mejora mantenimiento y testabilidad; hooks garantizan que no se persista contraseña en texto en cualquier punto que use `User.create`.

\*\*8) Reglas de negocio `Logica_de_Negocio_Multicine.md` (RN-021 a RN-034)

- No se encontró el archivo `Logica_de_Negocio_Multicine.md` en el repo ni referencias a `RN-021..RN-034` en el código.
- Con base en las siglas RN-021..RN-034 típicas de seguridad/usuarios, mapping parcial detectado:
    - Posibles RN cubiertas parcialmente: creación de `ActivationToken` (modelo) → RN relacionada con activación; `RefreshToken` modelo → RN relacionadas con sesión/refresh; `Membership` modelo → RN de membresías/Puntos.
    - Pendiente: orquestación de reglas (por ejemplo: "crear usuario + membership + token en una sola transacción"), bloqueos por intentos fallidos, y verificación de correo obligatorio antes de login.

Si adjuntas `Logica_de_Negocio_Multicine.md` (o me indicas dónde está), hago un mapeo exacto RN → implementado/parcial/pendiente.

**Issues, inconsistencias y recomendaciones urgentes**

- Inconsistencia de nombres de cookie: controlador escribe `accesstoken` (minúsculas) mientras que en `auth.middleware` en el `catch` se intenta `res.clearCookie('accessToken')` (camelCase). Uniformar el nombre y usar una constante compartida.
- `RefreshToken` y su revocación/invalidez no están implementadas en login/logout; implementar emisión de refresh token (guardar hash), revocar previos, y endpoint `/auth/refresh` seguro.
- `failedAttempts` y `lockedUntil` existen pero no se usan: implementar incremento en cada intento fallido y chequeo que bloquee logins hasta `lockedUntil`.
- `emailVerified` existe pero `findUser` no obliga verificación: bloquear el login si `emailVerified` es false (exigir activación primero).
- `roleMiddleware` no aprovecha `user_roles` (N:M): migrar a comprobación por relación (JOIN) para soportar múltiples roles por usuario.
- Añadir `express-rate-limit` y middleware `rateLimit` para endpoints sensibles (login, register) y `captcha` en registro/login si se desea.
- Añadir tests de integración para el flujo de login/refresh/lockout/activación.

**Acciones sugeridas inmediatas (PR mínimo)**

- Normalizar nombre de la cookie (`ACCESS_TOKEN_COOKIE = 'access_token'`) y aplicarlo en controlador y middleware.
- Implementar emisión y persistencia de Refresh Token en `auth.controller`/`auth.service` y endpoint `/auth/refresh` con revocación.
- Añadir lógica en `AuthUser.login` para: verificar `lockedUntil`, incrementar `failedAttempts` y fijar `lockedUntil` tras 5 fallos por 15 minutos.
- Implementar en `UserService.create` la creación de `ActivationToken` con `expiresAt = now + 24h` y envío de email (o enqueue job).
- Actualizar `roleMiddleware` para chequear roles a través de la relación N:M con `Role`.

---

Si quieres, genero de inmediato un PR con cambios mínimos: 1) normalizar cookie name, 2) implementar contador de intentos y bloqueo básico, 3) emitir refresh token y persistir su hash en `RefreshToken` y 4) agregar `express-rate-limit` en el endpoint de login. ¿Cuál de esas acciones quieres que haga primero?
