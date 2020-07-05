import { ApolloServer } from "apollo-server";

import { resolvers, typeDefs } from "./graphql";
import { Database } from "./database";
import { logger } from "./logger";

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  introspection: true,
});

Database.connect().then(() => {
  server.listen({ port: process.env.PORT ?? 4000 }).then(() => {
    logger.debug(`🚀 server up and running`);
  });
});
