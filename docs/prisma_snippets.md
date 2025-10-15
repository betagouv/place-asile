# Table des matière
- [Table des matière](#table-des-matière)
- [Quelques snippets pour aller plus loin avec Prisma](#quelques-snippets-pour-aller-plus-loin-avec-prisma)
  - [Migration](#migration)
  - [Évolution du schéma](#évolution-du-schéma)
  - [Vues SQL](#vues-sql)
    - [Pourquoi des vues ?](#pourquoi-des-vues-)
    - [Views sur Prisma](#views-sur-prisma)
    - [Process recommandé](#process-recommandé)
    - [Notes importantes](#notes-importantes)

# Quelques snippets pour aller plus loin avec Prisma

[Source](https://www.prisma.io/docs/orm/prisma-migrate/workflows/prototyping-your-schema)

## Migration

- Le temps de dev la branche, utiliser essentiellement l'outil de prototypage `npx prisma db push` (et éventuellement `npx prisma generate` pour générer le schéma) -> Sur le projet géré via `yarn prisma:push`

- Avant PR
    - `yarn prisma:reset`
    - `yarn prisma:migrate:name <nom_migration>`

- Ensuite comparer `migration.sql` dans le bon dossier et vérifier les opérations (notamment pas de suppression hasardeuse)

- Enfin pour le déploiement `npx prisma migrate deploy`

## Évolution du schéma
À chaque évolution, mettre à jour :
- Le seeder associé dans `src/prisma/seeders`
- Le type dans `src/types` et dans `src/app/api/structures`

## Vues SQL

### Pourquoi des vues ?
Les vues sont créées afin de servir facilement différents outils (front de Place d'Asile, Metabase) avec les mêmes objets. Elles ne sont pas matérialisées et sont donc systématiquement à jour.

### Views sur Prisma
Prisma a réemment introduit le principe de [views](https://www.prisma.io/docs/orm/prisma-schema/data-model/views) (encore en preview)

Cela nécessite : 
- L'ajout d'une fonctionnalité `views` dans `previewFeatures`
- L'ajout des schémas par table dans `datasource.schemas` (si on gère différents schémas)

### Process recommandé
L'ordre est le suivant : 
- Modification éventuelle des tables du schema et migration prisma classique
- Ajout de vues dans le dossier ./prisma/views puis exécution via 
```bash
yarn prisma:apply-views
```
- Ajout des vues au schéma prisma (à la main)

### Notes importantes
- Les vues sont en lecture seule dans Prisma Client
- L'introspection (`npx prisma db pull`) peut être utilisée pour générer les blocs `view`, mais attention aux fichiers `.sql` générés automatiquement et au `prisma.schema` modifié automatiquement
- Éviter de commit les fichiers générés si on utilise l'introspection
