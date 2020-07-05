#!/bin/bash

docker-compose start postgres

if [ -z "${DB_URL}" ]; then
    export $(cat .env | xargs)
    export DB_URL=postgres://postgres:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}
fi

npm run build && npx typeorm $@ --config build/ormconfig
