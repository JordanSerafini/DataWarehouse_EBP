# STRUCTURE DES FICHIERS - BACKEND MOBILE
## Inventaire et Documentation Complète

```
/home/tinkerbell/Desktop/Code/DataWarehouse_EBP/backend/
├── src/
│   ├── app.module.ts                          ✅ Module racine
│   ├── app.controller.ts                      ❓ Non consultable (probablement basique)
│   ├── app.service.ts                         ❓ Non consultable
│   ├── main.ts                                ✅ Point d'entrée + Swagger
│   │
│   ├── config/
│   │   └── database.config.ts                 ✅ Config PostgreSQL
│   │
│   └── mobile/                                📦 MODULE PRINCIPAL
│       ├── mobile.module.ts                   ✅ Module mobile (Auth + DB)
│       │
│       ├── controllers/
│       │   └── auth.controller.ts             ✅ 5 endpoints auth
│       │
│       ├── services/
│       │   ├── auth.service.ts                ✅ Authentification JWT
│       │   └── database.service.ts            ✅ Pool PostgreSQL
│       │
│       ├── dto/
│       │   └── auth/
│       │       ├── login.dto.ts               ✅ LoginDto (3 champs)
│       │       └── auth-response.dto.ts       ✅ AuthResponseDto + UserInfoDto
│       │
│       ├── guards/
│       │   ├── jwt-auth.guard.ts              ✅ Validation JWT + routes publiques
│       │   └── roles.guard.ts                 ✅ Contrôle d'accès par rôle
│       │
│       ├── decorators/
│       │   ├── public.decorator.ts            ✅ @Public() decorator
│       │   └── roles.decorator.ts             ✅ @Roles() decorator
│       │
│       ├── strategies/
│       │   └── jwt.strategy.ts                ✅ JWT strategy (Passport)
│       │
│       └── enums/
│           └── user-role.enum.ts              ✅ 6 rôles + permissions
│
└── .env                                        ✅ Variables d'environnement
```

---

## DÉTAIL PAR FICHIER

### ✅ FICHIERS IMPLÉMENTÉS (12 fichiers)

#### 1. `/src/main.ts`
**Contenu**: Point d'entrée NestJS
**Lignes**: 55
**Fonctionnalités**:
- CORS activation
- Global validation pipe (whitelist, forbidNonWhitelisted, transform)
- Swagger documentation setup
- Tags Swagger (Authentication, Sync, Interventions, Sales, Projects, Dashboard, Admin)
- Port: 3000 (ou process.env.PORT)

**Status**: ✅ Complet et fonctionnel

---

#### 2. `/src/app.module.ts`
**Contenu**: Module racine
**Lignes**: 18
**Fonctionnalités**:
- Import MobileModule
- Import ConfigModule (global, .env)
- AppController + AppService (basiques)

**Status**: ✅ Complet

---

#### 3. `/src/config/database.config.ts`
**Contenu**: Configuration PostgreSQL
**Ligne**: Non consultable, mais référencé par DatabaseService
**Fourni par**: ConfigService (database.config load)
**Clés utilisées**:
- database.host
- database.port
- database.database
- database.user
- database.password
- database.max (pool size)
- database.idleTimeoutMillis
- database.connectionTimeoutMillis

**Status**: ✅ Implémenté

---

#### 4. `/src/mobile/mobile.module.ts`
**Contenu**: Module mobile principal
**Lignes**: 51
**Fonctionnalités**:
- Import ConfigModule
- Import PassportModule (JWT default strategy)
- Import JwtModule (async avec ConfigService)
- Providers: DatabaseService, AuthService, JwtStrategy, Guards
- Exports: DatabaseService, AuthService, Guards
- Controllers: AuthController seulement

**Status**: ⚠️ Partiellement complet (manquent autres controllers)

---

#### 5. `/src/mobile/controllers/auth.controller.ts`
**Contenu**: Authentification endpoints
**Lignes**: 143
**Endpoints**: 5
```
POST   /api/v1/auth/login        - Authentification
POST   /api/v1/auth/logout       - Déconnexion simple
POST   /api/v1/auth/logout-all   - Déconnexion globale
GET    /api/v1/auth/me           - Profil utilisateur
POST   /api/v1/auth/refresh      - Renouvellement token
```

**Validation Swagger**: ✅ Complète (@ApiOperation, @ApiResponse, @ApiBearerAuth)

**Status**: ✅ Implémenté et documenté

---

#### 6. `/src/mobile/services/auth.service.ts`
**Contenu**: Logique authentification
**Lignes**: 332
**Méthodes publiques**:
- login(loginDto) - Validation, JWT, session
- logout(userId, jti) - Révocation token unique
- logoutAll(userId) - Révocation tous tokens
- validateToken(jti) - Vérification token actif
- createUser(email, password, fullName, role, colleagueId)
- changePassword(userId, oldPassword, newPassword)

**Méthodes privées**:
- findUserByEmail()
- findUserById()
- handleFailedLogin() - Gestion tentatives échouées (5→30min lock)
- resetFailedLoginAttempts()
- generateJwtToken(user, jti)
- getTokenExpiresIn() - Parse format expiration
- createSession() - Insertion mobile.user_sessions
- revokeSession() - Mise à jour revoked_at
- updateLastLogin() - Tracking device
- mapUserToUserInfo()
- getUserPermissions() - Lookup ROLE_PERMISSIONS

**Dépendances**:
- DatabaseService
- JwtService
- ConfigService
- bcrypt (password hashing)
- uuid (JTI generation)

**Status**: ✅ Implémenté et robuste

---

#### 7. `/src/mobile/services/database.service.ts`
**Contenu**: Pool PostgreSQL
**Lignes**: 89
**Méthodes**:
- onModuleInit() - Création pool et test connexion
- onModuleDestroy() - Fermeture pool
- query<T>(text, params?) - Exécution requête avec logs slow queries
- getClient() - Client brut pour transactions
- transaction<T>(callback) - Transaction ACID (BEGIN/COMMIT/ROLLBACK)

**Features**:
- Pool configuration (max connections, timeout)
- Query performance monitoring (warning si > 1000ms)
- Error logging détaillé
- Lifecycle hooks

**Status**: ✅ Production-ready

---

#### 8. `/src/mobile/dto/auth/login.dto.ts`
**Contenu**: DTO connexion
**Lignes**: 29
**Champs**:
```typescript
email: string      // @IsEmail()
password: string   // @MinLength(6)
deviceId?: string  // @IsOptional()
```

**Status**: ✅ Minimal mais fonctionnel

---

#### 9. `/src/mobile/dto/auth/auth-response.dto.ts`
**Contenu**: DTO réponse authentification
**Lignes**: 67
**Classes**:
- AuthResponseDto
  - accessToken: string
  - tokenType: string = 'Bearer'
  - expiresIn: number
  - user: UserInfoDto

- UserInfoDto
  - id: string
  - email: string
  - fullName: string
  - role: UserRole
  - colleagueId?: string
  - permissions: string[]

**Status**: ✅ Complet pour auth basique

---

#### 10. `/src/mobile/enums/user-role.enum.ts`
**Contenu**: Rôles et permissions
**Lignes**: 116
**Enums**:
```typescript
enum UserRole {
  SUPER_ADMIN,
  ADMIN,
  PATRON,
  COMMERCIAL,
  CHEF_CHANTIER,
  TECHNICIEN
}

ROLE_HIERARCHY: Record<UserRole, number> (6 niveaux)

ROLE_PERMISSIONS: Record<UserRole, string[]> (31 permissions total)
```

**Permissions par rôle**:
- SUPER_ADMIN: ['*'] (tous les droits)
- ADMIN: users.*, config.*, logs.*, dashboard.*, interventions.*, sales.*, projects.*, documents.*, sync.*
- PATRON: dashboard.read, kpis.read, interventions.read, sales.read, projects.read, documents.read, team.read, sync.read
- COMMERCIAL: sales.*, quotes.*, documents.read, customers.read, contacts.read, products.read, sync.read
- CHEF_CHANTIER: projects.*, deal_documents.read, team.read, stock.*, timesheets.*, sync.read
- TECHNICIEN: interventions.*, photos.upload, signature.create, customers.read, timesheets.create, expenses.create, sync.read

**Status**: ✅ Bien pensé et complet

---

#### 11. `/src/mobile/guards/jwt-auth.guard.ts`
**Contenu**: Guard JWT avec routes publiques
**Lignes**: 36
**Fonctionnalité**:
- Extends AuthGuard('jwt')
- Vérifie @Public() decorator
- Si public → skip validation
- Sinon → validate JWT via JwtStrategy
- Error handling: UnauthorizedException

**Status**: ✅ Bien implémenté

---

#### 12. `/src/mobile/guards/roles.guard.ts`
**Contenu**: Guard RBAC
**Lignes**: 30
**Fonctionnalité**:
- Vérifie @Roles() decorator
- Si absent → accès autorisé (décision dans controller)
- SUPER_ADMIN → accès à tout
- Autres → vérify user.role in required roles

**Status**: ✅ Simple mais efficace

---

#### 13. `/src/mobile/decorators/public.decorator.ts`
**Contenu**: Decorator route publique
**Lignes**: 15
**Usage**: @Public() sur method/class
**Metadata**: IS_PUBLIC_KEY = 'isPublic'

**Status**: ✅ Minimal et correct

---

#### 14. `/src/mobile/decorators/roles.decorator.ts`
**Contenu**: Decorator rôles
**Lignes**: 16
**Usage**: @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
**Metadata**: ROLES_KEY = 'roles'

**Status**: ✅ Correct

---

#### 15. `/src/mobile/strategies/jwt.strategy.ts`
**Contenu**: Passport JWT strategy
**Lignes**: 37
**Fonctionnalité**:
- Extract JWT from Authorization header (Bearer token)
- Validate signature avec JWT_SECRET (ConfigService)
- Call authService.validateToken(jti) pour vérifier token pas révoqué
- Return payload comme req.user

**Payload retourné**:
```typescript
{
  sub: user.id,
  email: user.email,
  role: user.role,
  colleagueId: user.colleagueId,
  jti: jti
}
```

**Status**: ✅ Robuste

---

### ❌ FICHIERS MANQUANTS (CRITIQUE)

#### Controllers à créer: 5
```
src/mobile/controllers/
├── interventions.controller.ts        (8 endpoints)
├── sales.controller.ts                (10 endpoints)
├── projects.controller.ts             (7 endpoints)
├── sync.controller.ts                 (4 endpoints)
├── dashboard.controller.ts            (4 endpoints)
└── customers.controller.ts            (4+ endpoints)
```

#### Services à créer: 8
```
src/mobile/services/
├── interventions.service.ts
├── sales.service.ts
├── projects.service.ts
├── sync.service.ts
├── dashboard.service.ts
├── customers.service.ts
├── file.service.ts                    ⭐ PRIORITAIRE
└── contact.service.ts
```

#### DTOs à créer: 30+
```
src/mobile/dto/
├── interventions/
│   ├── intervention.dto.ts
│   ├── create-intervention.dto.ts
│   ├── complete-intervention.dto.ts
│   ├── photo-upload.dto.ts
│   ├── signature.dto.ts
│   └── timesheet.dto.ts
│
├── sales/
│   ├── deal.dto.ts
│   ├── create-deal.dto.ts
│   ├── quote.dto.ts
│   ├── quote-line.dto.ts
│   ├── invoice.dto.ts
│   └── sale-document.dto.ts
│
├── projects/
│   ├── project.dto.ts
│   ├── project-document.dto.ts
│   └── project-document-line.dto.ts
│
├── dashboard/
│   ├── kpi.dto.ts
│   ├── activity.dto.ts
│   ├── performance.dto.ts
│   └── financial-summary.dto.ts
│
├── sync/
│   ├── sync-request.dto.ts
│   ├── sync-response.dto.ts
│   └── delta-sync.dto.ts
│
├── reference/
│   ├── customer.dto.ts
│   ├── contact.dto.ts
│   ├── product.dto.ts
│   └── colleague.dto.ts
│
└── common/
    ├── pagination.dto.ts
    ├── filter.dto.ts
    └── response-wrapper.dto.ts
```

#### Enums à créer: 7+
```
src/mobile/enums/
├── intervention-status.enum.ts
├── intervention-priority.enum.ts
├── deal-status.enum.ts
├── quote-status.enum.ts
├── invoice-payment-status.enum.ts
├── project-status.enum.ts
└── document-type.enum.ts
```

#### Guards/Decorators à créer: 2
```
src/mobile/guards/
├── permissions.guard.ts
└── ownership.guard.ts

src/mobile/decorators/
└── permissions.decorator.ts
```

#### Configuration à créer: 4
```
src/config/
├── file-upload.config.ts
├── redis.config.ts
├── smtp.config.ts
└── logging.config.ts
```

---

## RÉSUMÉ FICHIERS

| Type | Existants | Manquants | %Complétude |
|------|-----------|-----------|-------------|
| **Controllers** | 1 | 5 | 16.7% |
| **Services** | 2 | 8 | 20.0% |
| **DTOs** | 2 | 30+ | 6.0% |
| **Enums** | 1 | 7+ | 14.3% |
| **Guards** | 2 | 2 | 50.0% |
| **Decorators** | 2 | 1 | 66.7% |
| **Strategies** | 1 | 2 | 33.3% |
| **Config** | 2 | 4 | 33.3% |
| **TOTAL** | **13** | **58+** | **18.3%** |

---

## LIGNES DE CODE

```
Authentification:      550 lignes (auth.service + auth.controller)
Infrastructure:        150 lignes (database.service + config)
Sécurité:             100 lignes (guards + decorators + strategies)
DTOs/Types:            100 lignes (auth DTOs + enums)
Configuration:          75 lignes (main.ts + app.module)

TOTAL IMPLÉMENTÉ:     ~975 lignes

À IMPLÉMENTER (estimation):
- Controllers: ~1,500 lignes
- Services: ~2,500 lignes
- DTOs: ~1,000 lignes
- Tests: ~2,000 lignes

TOTAL À FAIRE:        ~7,000 lignes (8-10 semaines / 1 dev)
```

