import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { prismaClient } from "./lib/db";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  //create graphql server

  const GQLServer = new ApolloServer({
    typeDefs: `
      type Query{
        hello:String
        say(name:String):String
      }
      type Mutation{
        createUser(firstName:String!,lastName:String!,email:String!,password:String!): Boolean
      }
    `, //schema
    resolvers: {
      Query: {
        hello: () => `Hey there i am a graphql server`,
        say: (_, { name }: { name: string }) =>
          `Hey ${name} i am a graphql server`,
      },
      Mutation: {
        createUser: async (
          _,
          {
            firstName,
            lastName,
            email,
            password,
          }: {
            firstName: string;
            lastName: string;
            email: string;
            password: string;
          }
        ) => {
          await prismaClient.user.create({
            data: {
              firstName,
              lastName,
              email,
              password,
              salt: "random_salt",
            },
          });

          return true;
        },
      },
    }, //resolvers
  });

  // start the GQLServer server

  await GQLServer.start();

  app.get("/", (req, res) => {
    res.json({
      message: "Hello from server",
    });
  });

  app.use("/graphql", expressMiddleware(GQLServer));

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

init();
