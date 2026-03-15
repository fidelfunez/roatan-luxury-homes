#!/bin/bash
# Run Supabase migrations via CLI
# Usage: SUPABASE_DB_PASSWORD=yourpassword ./scripts/supabase-push.sh
# Or: ./scripts/supabase-push.sh yourpassword

set -e
cd "$(dirname "$0")/.."

PROJECT_REF="zseevllqomushqhlqpon"
PASSWORD="${SUPABASE_DB_PASSWORD:-$1}"

if [ -z "$PASSWORD" ]; then
  echo "Necesitas la contraseña de la base de datos."
  echo ""
  echo "Opcion 1 - Variable de entorno:"
  echo "  SUPABASE_DB_PASSWORD=tucontraseña ./scripts/supabase-push.sh"
  echo ""
  echo "Opcion 2 - Como argumento:"
  echo "  ./scripts/supabase-push.sh tucontraseña"
  echo ""
  echo "La contraseña la encontrás en: Supabase Dashboard > Project Settings > Database"
  exit 1
fi

echo "Conectando al proyecto Supabase..."
supabase link --project-ref "$PROJECT_REF" --password "$PASSWORD"

echo ""
echo "Aplicando migraciones..."
supabase db push

echo ""
echo "Listo. La base de datos está actualizada."
