set -e

SCRIPT_NAME=$1

if [ -z "$SCRIPT_NAME" ]; then
  echo "❌ Erreur : tu dois fournir le nom du script, ex : yarn one-off 20251020-migrate-forms-and-steps"
  exit 1
fi

echo "🚀 Installation des dépendances (dev inclues)..."
yarn install --production=false

echo "⚙️ Génération Prisma..."
npx prisma generate

echo "🏃 Exécution du script ${SCRIPT_NAME}.ts"
npx tsx prisma/one-off-scripts/${SCRIPT_NAME}.ts