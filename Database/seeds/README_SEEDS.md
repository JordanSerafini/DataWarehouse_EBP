# Seeds de Test - Interventions Jordan

## 📋 Vue d'ensemble

Ce dossier contient les scripts SQL pour peupler la base de données avec des données de test réalistes pour Jordan Pierre.

## 🚀 Utilisation

### Exécuter le seed principal

```bash
# Depuis le répertoire Database/seeds/
psql -h localhost -U postgres -d sli_db -f 010_interventions_jordan_complete.sql
```

### Ou directement avec PowerShell

```powershell
cd Database/seeds
Get-Content 010_interventions_jordan_complete.sql | psql -h localhost -U postgres -d sli_db
```

## 📦 Interventions créées

Le script `010_interventions_jordan_complete.sql` crée **6 interventions** pour Jordan:

| Référence | Statut | Type | Description |
|-----------|--------|------|-------------|
| **JORDN001** | SCHEDULED | Maintenance | Climatisation bureau - Planifié dans 2 jours |
| **JORDN002** | IN_PROGRESS | Dépannage URGENT | Serveur HS - En cours maintenant |
| **JORDN003** | COMPLETED | Installation | Poste directeur - Terminée hier |
| **JORDN004** | INVOICED | Formation | 8 personnes - Facturée |
| **JORDN005** | PENDING | Diagnostic | Réseau lent - En attente |
| **JORDN006** | IN_PROGRESS | Test Upload | **Intervention dédiée aux tests photos/signature** |

## ✅ Tests recommandés

### Tester JORDN006 (Upload)

1. **Backend**: Redémarrer après seed
   ```bash
   cd backend
   npm run start:prod
   ```

2. **Mobile**: Ouvrir l'intervention JORDN006
   - Elle devrait apparaître dans la liste (statut IN_PROGRESS)
   - Tester upload photo avec GPS
   - Tester capture signature

3. **Vérifier en base**:
   ```sql
   SELECT * FROM mobile.intervention_photos WHERE intervention_id = (
     SELECT "Id" FROM public."ScheduleEvent" WHERE "ScheduleEventNumber" = 'JORDN006'
   );

   SELECT * FROM mobile.intervention_signatures WHERE intervention_id = (
     SELECT "Id" FROM public."ScheduleEvent" WHERE "ScheduleEventNumber" = 'JORDN006'
   );
   ```

## 🔧 Maintenance

### Supprimer les interventions de test

```sql
DELETE FROM public."ScheduleEvent"
WHERE "ScheduleEventNumber" LIKE 'JORDN%';
```

### Vérifier les interventions créées

```sql
SELECT
  "ScheduleEventNumber" as reference,
  "Caption" as title,
  "EventState" as state,
  "Address_City" as city
FROM public."ScheduleEvent"
WHERE "ColleagueId" = 'JORDAN'
ORDER BY "ScheduleEventNumber";
```

## 📝 Notes

- Les anciennes interventions **INT-001** à **INT-005** sont supprimées automatiquement
- Les GPS coordonnées sont réelles (Paris et Île-de-France)
- Les clients sont assignés aléatoirement parmi les clients actifs
- JORDN006 est créée avec statut IN_PROGRESS pour test immédiat

## 🐛 Dépannage

### Erreur "Colleague JORDAN n'existe pas"

Exécutez d'abord:
```bash
psql -h localhost -U postgres -d sli_db -f 003_jordan_colleague_ebp.sql
```

### Erreur "Aucun client actif trouvé"

Vérifiez qu'il y a des clients dans la base:
```sql
SELECT COUNT(*) FROM public."Customer" WHERE "ActiveState" = 1;
```
