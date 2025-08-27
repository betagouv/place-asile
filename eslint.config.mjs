import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [{
  ignores: ["node_modules/**", ".next/**", "out/**", "build/**", "next-env.d.ts"]
}, ...compat.extends("next/core-web-vitals", "next/typescript"), {
  rules: {
    "no-restricted-imports": [
      "error",
      {
        paths: [
          {
            name: "@prisma/client",
            message: "L'import de @prisma/client est interdit en dehors de src/app/api/, lib/ ou prisma/."
          }
        ]
      }
    ]
  }
}, {
  files: [
    "src/app/api/**/*.{js,ts,jsx,tsx}",
    "lib/**/*.{js,ts,jsx,tsx}",
    "prisma/**/*.{js,ts,jsx,tsx}"
  ],
  rules: {
    "no-restricted-imports": "off"
  }
}];

export default eslintConfig;
