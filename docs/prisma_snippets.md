# Quelques snippets utils pour prisma

(Source)[https://www.prisma.io/docs/orm/prisma-migrate/workflows/prototyping-your-schema]

- Le temps de dev la branche, utiliser essentiellement l'outil de prototypage `npx prisma db push` (et éventuellement `npx prisma generate` pour générer le schéma) -> Sur le projet géré via `yarn prisma:push`

- Avant PR
    - `yarn prisma:reset`
    - `yarn prisma:migrate:name <nom_migration>`

- Ensuite comparer `migration.sql` dans le bon dossier et vérifier les opérations (notamment pas de suppression hasardeuse)

- Enfin pour le déploiement `npx prisma migrate deploy`

# Evolution du schéma
À chaque évolution, mettre à jour :
- Le seeder associé dans `src/prisma/seeders`
- Le type dans `src/types` et dans `src/app/api/structures`

