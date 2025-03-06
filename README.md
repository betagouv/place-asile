# Place d'asile

Piloter le parc de logements pour demandeurs d’asile

## ✨ Installation

Ce projet utilise [`yarn`](https://yarnpkg.com/) comme gestionnaire de dépendances.

D'abord, installez les dépendances :

```bash
yarn
```

## 🚀 Lancement

Ensuite, lancez le projet :

```bash
yarn dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) avec votre navigateur pour voir le résultat.

## 🧪 Tests

Pour lancer les tests, exécutez :

```bash
yarn test
```

Pour lancer les tests en continu, exécutez :

```bash
yarn test:watch
```

## 🎨 Formattage du code

Pour vérifier que tout le code est bien formatté, exécutez :

```bash
yarn lint
```

Pour vérifier qu'uniquement le code JS/TS/TSX est bien formatté, exécutez :

```bash
yarn lint:ts
```

Pour vérifier qu'uniquement le code CSS est bien formatté, exécutez :

```bash
yarn lint:css
```

## 🗃️ Base de données

Ce projet utilise [`Prisma`](https://www.prisma.io/docs) pour interagir avec la base de données PostgreSQL. Pour lancer la création de la base de données, remplissez d'abord la variable `DATABASE_URL` dans `.env` avec les identifiants de base de données. Puis, lancez la commande suivante pour construire la base de données :

```bash
yarn prisma:migrate
```

En cas de modification du schéma de données (dans `schema.prisma`), lancez la commande suivante et donnez un nom de migration en `camelCase` :

```bash
yarn prisma:migrate --create-only
```

Pour remplir la base avec des premières données, lancez :

```bash
yarn prisma:seed
```

Enfin, vous pouvez vérifier le contenu de la base de données en exécutant :

```bash
yarn prisma:studio
```
