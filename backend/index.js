import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone"

import { expressMiddleware} from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

import express from "express"
import http from "http"
import cors from "cors"
import dotenv from "dotenv"

import mergedTypeDefs from "./typeDefs/index.js";
import mergedResolvers from "./resolvers/index.js";

import { connectDB } from "./db/connectDB.js";

dotenv.config();

const app = express();
const httpServer = http.createServer(app)

const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    plugins:[ApolloServerPluginDrainHttpServer({httpServer})]
})

await server.start();

app.use("/",
    cors(),
    express.json(),
    expressMiddleware(server,{
        context:async({req})=>({req}),
    })
)

await new Promise((resolve)=>httpServer.listen({port:4000},resolve));
await connectDB()
// const { url } = await startStandaloneServer(server)

// console.log(`server ready at ${url}`)