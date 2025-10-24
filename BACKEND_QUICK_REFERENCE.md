# RÉFÉRENCE RAPIDE - BACKEND MOBILE (VOIR BACKEND_MOBILE_ANALYSIS.md pour détails)

**Complétude**: 15.2% | **Délai**: 14-16 semaines

## CE QUI EXISTE
- [x] AuthService (login, logout, jwt, sessions)
- [x] DatabaseService (pool postgresql)
- [x] AuthController (5 endpoints)
- [x] LoginDto + AuthResponseDto
- [x] JwtAuthGuard + RolesGuard
- [x] UserRole enum (6 rôles + 31 permissions)

## CE QUI MANQUE (CRITIQUE)
- [ ] FileService (photos, S3)
- [ ] SyncService (bidirectional, conflits)
- [ ] InterventionsService + Controller (8 endpoints)
- [ ] SalesService + Controller (10 endpoints)
- [ ] ProjectsService + Controller (7 endpoints)
- [ ] DashboardService + Controller (4 endpoints)
- [ ] CustomersService (référentiel)
- [ ] 30+ DTOs
- [ ] 7+ Enums métier
- [ ] Tests (unit + E2E)

## ENDPOINTS (5/70 EXISTANTS)
- POST /api/v1/auth/login ✅
- POST /api/v1/auth/logout ✅
- POST /api/v1/auth/logout-all ✅
- GET /api/v1/auth/me ✅
- POST /api/v1/auth/refresh ✅

## PROCHAINES ÉTAPES
1. Lire BACKEND_MOBILE_ANALYSIS.md
2. Implémenter FileService (semaine 1)
3. Implémenter SyncService (semaine 5)
4. Implémenter InterventionsService (semaine 6)

**Voir BACKEND_MOBILE_ANALYSIS.md pour analyse exhaustive!**
