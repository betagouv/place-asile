# Place d'asile

Piloter le parc de logements pour demandeurs d’asile

## ✨ Installation

Ce projet utilise [`yarn`](https://yarnpkg.com/) comme gestionnaire de dépendances.

D'abord, installez les dépendances :

```bash
yarn
```

## 👨‍💻 Lancement

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

En cas de besoin, la base de données peut être vidée avec :

```bash
yarn prisma:reset
```

Enfin, vous pouvez vérifier le contenu de la base de données en exécutant :

```bash
yarn prisma:studio
```

## 💅 Patch DSFR

En cas de mise à jour du DSFR, _il faut mettre à jour le patch_.

### Pourquoi ?

Par défaut le DSFR applique le CSS en dehors d'un layer ce qui pose des conflits avec Tailwind.
Il faut donc modifier le css du DSFR pour qu'il soit englobé dans un layer.
Et ce à chaque mise à jour du React-Dsfr.

### Voici les étapes à suivre :

1. Mettre à jour le package @codegouvfr/react-dsfr
2. Editer le fichier node_modules/@codegouvfr/react-dsfr/dsfr/dsfr.min.css en englobant le CSS dans un layer

```css
@layer dsfr {
  /* le CSS */
}
```

3. Patcher le package

```bash
npx patch-package @codegouvfr/react-dsfr
```

4. Vérifier le patch dans `patches/@codegouvfr+react-dsfr+{version}.patch`
5. Commit le patch
6. Le patch sera appliqué à chaque `yarn install`
7. Champagne !

## 🔓 Gestion des pages protégées par mot de passe

Pour le moment seule la route `/ajout-structure` est protégée par mot de passe.

Pour définir le mot de passe il suffit d'ajouter la variable `PAGE_PASSWORD` dans le fichier `.env`.

## 🚀 Mise en production

Pour mettre l'applcation en production, placez vous sur la branche `main` et exécutez :

```
git pull --rebase origin dev
git push --force-with-lease
```
