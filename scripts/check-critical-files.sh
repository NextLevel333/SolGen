#!/bin/bash

# Script to validate that critical project files exist
# This helps prevent accidental deployment of incomplete code

set -e

CRITICAL_FILES=(
  "package.json"
  "package-lock.json"
  "next.config.js"
  "tsconfig.json"
  "tailwind.config.js"
  "postcss.config.js"
  "src/components/Logo.tsx"
  "src/components/LandingContent.tsx"
  "src/components/WalletConnect.tsx"
  "src/components/WalletContextProvider.tsx"
  "src/components/HamburgerMenu.tsx"
  "src/components/PaymentGate.tsx"
  "src/components/VanityGenerator.tsx"
  "src/components/ResultDisplay.tsx"
  "src/pages/_app.tsx"
  "src/pages/index.tsx"
  "src/styles/globals.css"
  "public/SolGenLogo.png"
  "public/favicon.png"
)

MISSING_FILES=()

echo "🔍 Validating critical project files..."

for file in "${CRITICAL_FILES[@]}"; do
  if [ ! -f "$file" ]; then
    MISSING_FILES+=("$file")
    echo "❌ Missing: $file"
  else
    echo "✅ Found: $file"
  fi
done

if [ ${#MISSING_FILES[@]} -ne 0 ]; then
  echo ""
  echo "❌ ERROR: ${#MISSING_FILES[@]} critical file(s) are missing!"
  echo "The following files must be restored before deployment:"
  printf '  - %s\n' "${MISSING_FILES[@]}"
  exit 1
fi

echo ""
echo "✅ All critical files are present!"
exit 0
