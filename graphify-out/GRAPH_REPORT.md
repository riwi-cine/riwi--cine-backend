# Graph Report - .  (2026-08-10)

## Corpus Check
- Corpus is ~22,502 words - fits in a single context window. You may not need a graph.

## Summary
- 394 nodes · 745 edges · 48 communities (46 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46

## God Nodes (most connected - your core abstractions)
1. `sequelize` - 47 edges
2. `User` - 27 edges
3. `Currency` - 26 edges
4. `Country` - 21 edges
5. `CreateCurrencyDto` - 9 edges
6. `ICurrencyRepository` - 9 edges
7. `IUserRepository` - 9 edges
8. `ICurrencyService` - 9 edges
9. `IUserService` - 9 edges
10. `UserService` - 9 edges

## Surprising Connections (you probably didn't know these)
- `findUser()` --calls--> `generateToken()`  [EXTRACTED]
  app/src/controllers/auth.controller.ts → app/src/utils/jwt.ts
- `authMiddleware()` --calls--> `verifytoken()`  [EXTRACTED]
  app/src/middlewares/auth.middleware.ts → app/src/utils/jwt.ts
- `CountryRepository` --implements--> `ICountryRepository`  [EXTRACTED]
  app/src/repositories/country.repository.ts → app/src/repositories/interfaces/country.repository.interface.ts
- `CurrencyRepository` --implements--> `ICurrencyRepository`  [EXTRACTED]
  app/src/repositories/currency.repository.ts → app/src/repositories/interfaces/currency.repository.interface.ts
- `UserRepository` --implements--> `IUserRepository`  [EXTRACTED]
  app/src/repositories/user.repository.ts → app/src/repositories/interfaces/user.repository.interface.ts

## Import Cycles
- None detected.

## Communities (48 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.10
Nodes (13): createCurrency(), deleteCurrency(), getCurrencies(), restoreCurrency(), updateCurrency(), CreateCurrencyDto, Currency, CurrencyAttributes (+5 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (8): CreateUserDto, User, UserAttributes, UserCreationAttributes, IUserRepository, UserRepository, IUserService, UserService

### Community 2 - "Community 2"
Cohesion: 0.09
Nodes (22): findUser(), createUser(), deleteUser(), findUser(), getUsers(), restoreUser(), updateUser(), options (+14 more)

### Community 3 - "Community 3"
Cohesion: 0.14
Nodes (12): createCountry(), getAllCountries(), getCountryByName(), CreateCountryDto, Country, CountryAttributes, CountryCreationAttributes, CountryRepository (+4 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (26): dependencies, bcrypt, cookie-parser, express, jsonwebtoken, pg, sequelize, swagger-jsdoc (+18 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (25): devDependencies, jest, ts-jest, tsx, @types/bcrypt, @types/cookie-parser, @types/express, @types/jest (+17 more)

### Community 6 - "Community 6"
Cohesion: 0.13
Nodes (14): compilerOptions, esModuleInterop, forceConsistentCasingInFileNames, module, skipLibCheck, strict, target, types (+6 more)

### Community 7 - "Community 7"
Cohesion: 0.39
Nodes (5): CinemaRoomType, CinemaRoomTypeAttributes, SeatLock, SeatLockAttributes, SeatLockCreationAttributes

### Community 8 - "Community 8"
Cohesion: 0.29
Nodes (6): CineFlashActivation, CineFlashActivationAttributes, CineFlashActivationCreationAttributes, DocumentType, DocumentTypeAttributes, DocumentTypeCreationAttributes

### Community 9 - "Community 9"
Cohesion: 0.29
Nodes (6): Genre, GenreAttributes, GenreCreationAttributes, RefreshToken, RefreshTokenAttributes, RefreshTokenCreationAttributes

### Community 10 - "Community 10"
Cohesion: 0.50
Nodes (4): sequelize, Snack, SnackAttributes, SnackCreationAttributes

### Community 12 - "Community 12"
Cohesion: 0.67
Nodes (3): ActivationToken, ActivationTokenAttributes, ActivationTokenCreationAttributes

### Community 13 - "Community 13"
Cohesion: 0.67
Nodes (3): AuditLog, AuditLogAttributes, AuditLogCreationAttributes

### Community 14 - "Community 14"
Cohesion: 0.67
Nodes (3): Cart, CartAttributes, CartCreationAttributes

### Community 15 - "Community 15"
Cohesion: 0.67
Nodes (3): CartSnack, CartSnackAttributes, CartSnackCreationAttributes

### Community 16 - "Community 16"
Cohesion: 0.67
Nodes (3): Cinema, CinemaAttributes, CinemaCreationAttributes

### Community 17 - "Community 17"
Cohesion: 0.67
Nodes (3): CinemaSnack, CinemaSnackAttributes, CinemaSnackCreationAttributes

### Community 18 - "Community 18"
Cohesion: 0.67
Nodes (3): City, CityAttributes, CityCreationAttributes

### Community 19 - "Community 19"
Cohesion: 0.67
Nodes (3): Department, DepartmentAttributes, DepartmentCreationAttributes

### Community 20 - "Community 20"
Cohesion: 0.67
Nodes (3): Function, FunctionAttributes, FunctionCreationAttributes

### Community 21 - "Community 21"
Cohesion: 0.67
Nodes (3): FunctionType, FunctionTypeAttributes, FunctionTypeCreationAttributes

### Community 22 - "Community 22"
Cohesion: 0.67
Nodes (3): GiftCard, GiftCardAttributes, GiftCardCreationAttributes

### Community 23 - "Community 23"
Cohesion: 0.67
Nodes (3): GiftCardRedemption, GiftCardRedemptionAttributes, GiftCardRedemptionCreationAttributes

### Community 24 - "Community 24"
Cohesion: 0.67
Nodes (3): Membership, MembershipAttributes, MembershipCreationAttributes

### Community 25 - "Community 25"
Cohesion: 0.67
Nodes (3): Movie, MovieAttributes, MovieCreationAttributes

### Community 26 - "Community 26"
Cohesion: 0.67
Nodes (3): MovieRelease, MovieReleaseAttributes, MovieReleaseCreationAttributes

### Community 27 - "Community 27"
Cohesion: 0.67
Nodes (3): Notification, NotificationAttributes, NotificationCreationAttributes

### Community 28 - "Community 28"
Cohesion: 0.67
Nodes (3): Order, OrderAttributes, OrderCreationAttributes

### Community 29 - "Community 29"
Cohesion: 0.67
Nodes (3): OrderPromotion, OrderPromotionAttributes, OrderPromotionCreationAttributes

### Community 30 - "Community 30"
Cohesion: 0.67
Nodes (3): OrderSnack, OrderSnackAttributes, OrderSnackCreationAttributes

### Community 31 - "Community 31"
Cohesion: 0.67
Nodes (3): Payment, PaymentAttributes, PaymentCreationAttributes

### Community 32 - "Community 32"
Cohesion: 0.67
Nodes (3): PointTransaction, PointTransactionAttributes, PointTransactionCreationAttributes

### Community 33 - "Community 33"
Cohesion: 0.67
Nodes (3): PQRS, PQRSAttributes, PQRSCreationAttributes

### Community 34 - "Community 34"
Cohesion: 0.67
Nodes (3): PromotionCinema, PromotionCinemaAttributes, PromotionCinemaCreationAttributes

### Community 35 - "Community 35"
Cohesion: 0.67
Nodes (3): PromotionFunctionType, PromotionFunctionTypeAttributes, PromotionFunctionTypeCreationAttributes

### Community 36 - "Community 36"
Cohesion: 0.67
Nodes (3): Promotion, PromotionAttributes, PromotionCreationAttributes

### Community 37 - "Community 37"
Cohesion: 0.67
Nodes (3): Role, RoleAttributes, RoleCreationAttributes

### Community 38 - "Community 38"
Cohesion: 0.67
Nodes (3): Room, RoomAttributes, RoomCreationAttributes

### Community 39 - "Community 39"
Cohesion: 0.67
Nodes (3): RoomType, RoomTypeAttributes, RoomTypeCreationAttributes

### Community 40 - "Community 40"
Cohesion: 0.67
Nodes (3): Seat, SeatAttributes, SeatCreationAttributes

### Community 41 - "Community 41"
Cohesion: 0.67
Nodes (3): Survey, SurveyAttributes, SurveyCreationAttributes

### Community 42 - "Community 42"
Cohesion: 0.67
Nodes (3): Ticket, TicketAttributes, TicketCreationAttributes

### Community 43 - "Community 43"
Cohesion: 0.67
Nodes (3): TicketTransfer, TicketTransferAttributes, TicketTransferCreationAttributes

### Community 44 - "Community 44"
Cohesion: 0.67
Nodes (3): UserDocument, UserDocumentAttributes, UserDocumentCreationAttributes

### Community 45 - "Community 45"
Cohesion: 0.67
Nodes (3): UserRole, UserRoleAttributes, UserRoleCreationAttributes

## Knowledge Gaps
- **82 isolated node(s):** `config`, `name`, `version`, `description`, `main` (+77 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `sequelize` connect `Community 10` to `Community 0`, `Community 1`, `Community 2`, `Community 3`, `Community 7`, `Community 8`, `Community 9`, `Community 11`, `Community 12`, `Community 13`, `Community 14`, `Community 15`, `Community 16`, `Community 17`, `Community 18`, `Community 19`, `Community 20`, `Community 21`, `Community 22`, `Community 23`, `Community 24`, `Community 25`, `Community 26`, `Community 27`, `Community 28`, `Community 29`, `Community 30`, `Community 31`, `Community 32`, `Community 33`, `Community 34`, `Community 35`, `Community 36`, `Community 37`, `Community 38`, `Community 39`, `Community 40`, `Community 41`, `Community 42`, `Community 43`, `Community 44`, `Community 45`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Why does `User` connect `Community 1` to `Community 2`, `Community 7`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `Country` connect `Community 3` to `Community 1`, `Community 7`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **What connects `config`, `name`, `version` to the rest of the system?**
  _82 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.09898989898989899 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.11336032388663968 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.08708708708708708 - nodes in this community are weakly interconnected._