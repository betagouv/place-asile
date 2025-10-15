⚠️ TO BE MERGED WITH GLOBAL PRISMA DOCUMENTATION AFTER PRs

# Vues SQL

## Pourquoi des vues ?
Les vues sont créées afin de servir facilement différents outils (front de Place d'Asile, metabase) avec les mêmes objets. Elles ne sont pas matérialisées et sont donc systématiquement à jour.

## Views sur Prisma
Prisma a réemment introduit le principe de (views)[https://www.prisma.io/docs/orm/prisma-schema/data-model/views] (encore en preview)

Cela nécessite : 
- L'ajout d'une fonctionnalité `views` dans `previewFeatures`
- L'ajout des schémas par table dans `datasource.schemas` (si on gère différents schémas)

## Process recommandé
L'ordre est le suivant : 
- Modification éventuelle des tables du schema et migration prisma classique
- Ajout de vues dans le dossier ./prisma/views puis exécution via 
```bash
yarn prisma:apply-views
```
- Ajout des vues au schéma prisma (à la main)

## Notes importantes
- Les vues sont en lecture seule dans Prisma Client
- L'introspection (`npx prisma db pull`) peut être utilisée pour générer les blocs `view`, mais attention aux fichiers `.sql` générés automatiquement et au `prisma.schema` modifié automatiquement
- Éviter de commit les fichiers générés si on utilise l'introspection
