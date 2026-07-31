#!/bin/sh

set -e

echo "Ejecutando migraciones"

npm run migrate

echo "Iniciando API"

exec npm run dev