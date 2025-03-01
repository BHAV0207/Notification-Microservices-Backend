const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const dotenv = require("dotenv");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolver");

dotenv.config();

async function startApolloServer() {
  const app = express();

  const server = new ApolloServer({ typeDefs, resolvers  ,context: ({ req }) => ({ req })});

  await server.start();

  server.applyMiddleware({ app, path: "/graphql" });

  const PORT = process.env.PORT || 7000;
  app.listen(PORT, () => {
    console.log(
      `🚀 GraphQL Server running at http://localhost:${PORT}/graphql`
    );
  });
}

startApolloServer().catch((err) => {
  console.error("server failed to start", err);
});
