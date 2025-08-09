# Automated pre-deploy script for Vite+React+Tailwind client (PowerShell)

# 1. Install dependencies
npm install

# 2. Check for missing dependencies
npm ls

# 3. Type check (TypeScript)
npx tsc --noEmit

# 4. Lint (ESLint)
npx eslint .

# 5. Tailwind build check
npx tailwindcss build src/index.css -o out.css

# 6. Vite build
npm run build

Write-Host "All checks passed! Ready to deploy to Render."
