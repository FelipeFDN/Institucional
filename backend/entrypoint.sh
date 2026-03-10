#!/bin/sh

echo "Aguardando banco de dados..."
until npx sequelize-cli db:migrate 2>&1; do
  echo "Migrations falharam, tentando novamente em 3s..."
  sleep 3
done

echo "Migrations executadas com sucesso!"
exec npm run start
