# Graphql shopping cart
This service exposes a Node.js based graphql backend for shopping carts.  

## Tech stack
 - Node.js (12.x)
 - Typescript
 - jest
 - Graphql
 - Typeorm
 - PostgreSQL

### Running locally

If it's your first run:
-  run **`npm install`** to download all the required dependencies.
-  Create the database schema with **`npm run typeorm -- schema:sync`**

Just run `npm start` and a graphql server will be accessible at http://localhost:4000.
The required environment variables are available in the `.env` file.
Any changes to the source files will trigger a full reload of the project. 

If you see some problems related to the database columns when using the app:
  - stop the app with Ctrl+C
  - drop the schema: `npm run typeorm -- schema:drop`
  - Recreate the schema: `npm run typeorm -- schema:sync`
  - start the app with `npm start`

In test environment, an one-off postgres container will be created and the database schema will be automatically exported before tests execution. 

In production, you must create migrations to evolve your database schema and apply them manually. See the *Useful commands* section below to know how.


### Useful commands
- Build ( TS transpiling and resources copying to the *build* folder )
  - `npm run build` 
- Run tests
  - `npm test`
- Drop the database schema (You'll lost all your existing data):
  - `npm run typeorm -- schema:drop`
- Create yout database schema:
  - `npm run typeorm -- schema:sync` 
- Show database migration scripts:
  - `npm run typeorm -- migration:show`
- Create a new migration script:
  - `npm run typeorm -- migration:create -n <<MigrationClassName>>`
- Run pending migrations:
  - `npm run typeorm -- migration:run`
- Additional typeorm CLI commands:
  - `npm run typeorm -- -h`

> In order to run the above typeorm CLI commands against another db, you can prefix the command with the DB_URL env var, like this: 
> -  `DB_URL=postgres://user:password@host:port/database-name npm run typeorm -- migration:run`