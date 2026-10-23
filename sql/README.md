# Dossier SQL — Base de Données PostgreSQL pour SIRH

**Projet :** Système d'Information des Ressources Humaines (SIRH)  
**Conception :** Équipe Steeve, Tanteraka, Tsimbina  
**Moteur de Base de Données :** PostgreSQL 14+ / 16+  
**Architecture :** 29 tables métier réparties sur 4 blocs + transverse, triggers d'audit immuables, intégrité référentielle stricte.

---

## 📁 Structure des Scripts Dédiés

| Fichier | Description | Ordre d'Exécution |
| :--- | :--- | :--- |
| `01_extensions_and_types.sql` | Extensions PostgreSQL (`uuid-ossp`, `pgcrypto`) et types `ENUM` métier | 1 |
| `02_schema_transverse.sql` | Utilisateurs, Rôles, Référentiels, Paramètres, Journal des mouvements (audit), Notifications | 2 |
| `03_schema_bloc1_besoin.sql` | Unités organisationnelles (Départements & Services), Postes, Demandes de recrutement et Validations | 3 |
| `04_schema_bloc2_recrutement.sql`| Offres d'emploi, Candidats, Candidatures, Grilles & Critères, Entretiens & Évaluations | 4 |
| `05_schema_bloc3_embauche.sql` | Propositions d'embauche versionnées, Dossiers Employés, Documents/Pièces requises | 5 |
| `06_schema_bloc4_onboarding.sql` | Contrats de travail, Affectations successives, Modèles & Tâches d'Onboarding, Alertes d'échéances | 6 |
| `07_triggers_and_functions.sql` | Fonctions PL/pgSQL & Déclencheurs (Génération automatique du Matricule RG15, Audit JSONB RG18, Anti-conflit de créneaux RG09, Calcul des vacances de postes) | 7 |
| `08_seed_data.sql` | Jeu de données complet pour démonstration et mise en production immédiate | 8 |
| `09_views_and_reports.sql` | Vues d'analyse RH (Entonnoir de recrutement, Taux de vacance, Suivi de complétude des dossiers) | 9 |

---

## 🚀 Ordre d'Exécution Global (Script Shell / psql)

Pour initialiser la base de données PostgreSQL complète :

```bash
# Création de la base
psql -U postgres -c "CREATE DATABASE sirh_db WITH ENCODING 'UTF8';"

# Exécution ordonnée
psql -U postgres -d sirh_db -f sql/01_extensions_and_types.sql
psql -U postgres -d sirh_db -f sql/02_schema_transverse.sql
psql -U postgres -d sirh_db -f sql/03_schema_bloc1_besoin.sql
psql -U postgres -d sirh_db -f sql/04_schema_bloc2_recrutement.sql
psql -U postgres -d sirh_db -f sql/05_schema_bloc3_embauche.sql
psql -U postgres -d sirh_db -f sql/06_schema_bloc4_onboarding.sql
psql -U postgres -d sirh_db -f sql/07_triggers_and_functions.sql
psql -U postgres -d sirh_db -f sql/08_seed_data.sql
psql -U postgres -d sirh_db -f sql/09_views_and_reports.sql
```

---

## 🔒 Principes d'Architecture & Règles de Gestion (RG)

- **RG01** : Un poste existe indépendamment de tout employé avec effectif autorisé et calcul des vacances.
- **RG03 / RG04** : Circuit de validation séquentiel (Manager ➔ RH ➔ Finance ➔ Direction) avec obligation de motif pour refus/renvoi/mise en attente.
- **RG07 / RG08** : Distinction stricte entre Candidat et Employé, détection d'unicité (Email, CIN, Nom + Date de naissance).
- **RG09** : Détection de chevauchement sur les créneaux d'entretiens et les salles.
- **RG12** : Opération indivisible lors de l'acceptation de la proposition d'embauche (Création Employé + Contrat + Affectation + Tâches Onboarding).
- **RG15** : Matricule unique et séquentiel généré à la signature du premier contrat (ex: `EMP-2026-0001`).
- **RG17 / RG18** : Aucune suppression physique (`is_deleted` et timestamp `deleted_at`), journalisation systématique de chaque mouvement en base avec delta avant/après.
