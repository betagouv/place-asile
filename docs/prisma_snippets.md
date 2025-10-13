# Quelques snippets utils pour prisma

- Le temps de dev sur un sprint, utiliser essentiellement l'outil de prototypage `npx prisma db push` (et éventuellement `npx prisma generate` pour générer le schéma)

- En fin de sprint `npx prisma migrate dev --name sprint_<nom_du_sprint>`

- Ensuite comparer `migration.sql` dans le bon dossier et vérifir les opérations (notamment pas de suppression hasardeuse)

- Enfin pour le déploiement `npx prisma migrate deploy`

# Evolution du schéma
À chaque évolution, mettre à jour :
- Le seeder associé dans `src/prisma/seeders`
- Le type dans `src/types` et dans `src/app/api/structures`

