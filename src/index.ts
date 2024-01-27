import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

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
    `, //schema
    resolvers: {
      Query: {
        hello: () => `Hey there i am a graphql server`,
        say: (_, { name }: { name: string }) =>
          `Hey ${name} i am a graphql server`,
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
