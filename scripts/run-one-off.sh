# Bash pour exécuter un script one off (par exemple post migration db pour créer des équivalences entre old et new field)

set -e

SCRIPT_NAME=$1
shift || true # retire le nom du script des arguments

if [ -z "$SCRIPT_NAME" ]; then
  echo "❌ Erreur : merci de fournir le nom du script. Exemple : yarn one-off 20251020-migrate-forms-and-steps"
  exit 1
fi

echo "🚀 Installation des dépendances"
yarn install --production=false

echo "🏃 Exécution du script ${SCRIPT_NAME}.ts"
npx tsx scripts/one-off-scripts/${SCRIPT_NAME}.ts "$@"