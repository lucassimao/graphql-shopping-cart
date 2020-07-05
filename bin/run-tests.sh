#!/bin/sh

docker-compose stop
export POSTGRES_PASSWORD=123
export POSTGRES_DB=testdb

docker run --name temp_postgres --rm  -e POSTGRES_PASSWORD -e POSTGRES_DB -p 5432:5432 -d postgres:12-alpine
export DB_URL=postgres://postgres:${POSTGRES_PASSWORD}@localhost:5432/${POSTGRES_DB}
./bin/wait-for-it.sh localhost:5432 -- npx "jest"
docker stop temp_postgres
