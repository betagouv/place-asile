#!/bin/bash

# Find all files that import useStructureContext from StructureContext
find /Users/jeremie/place-asile-cleanup/place-asile/src -type f -name "*.tsx" -o -name "*.ts" | xargs grep -l "import.*useStructureContext.*from.*StructureContext" | while read -r file; do
  # Replace the import statement
  if grep -q "import { useStructureContext } from \"../context/StructureContext\";" "$file"; then
    sed -i '' 's/import { useStructureContext } from "..\/context\/StructureContext";/import { useStructureContext } from "..\/context\/StructureClientContext";/g' "$file"
  elif grep -q "import { useStructureContext } from \"@\/app\/(authenticated)\/structures\/\[id\]\/context\/StructureContext\";" "$file"; then
    sed -i '' 's/import { useStructureContext } from "@\/app\/(authenticated)\/structures\/\[id\]\/context\/StructureContext";/import { useStructureContext } from "@\/app\/(authenticated)\/structures\/\[id\]\/context\/StructureClientContext";/g' "$file"
  elif grep -q "import { useStructureContext } from \"\.\/context\/StructureContext\";" "$file"; then
    sed -i '' 's/import { useStructureContext } from "\.\/context\/StructureContext";/import { useStructureContext } from "\.\/context\/StructureClientContext";/g' "$file"
  fi
done

echo "Import statements updated successfully!"
