//apollo server
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone"

//plugin
import { expressMiddleware } from "@apollo/server/express4"
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";

//server
import express from "express"
import http from "http"
import cors from "cors"
import dotenv from "dotenv"

//session
import passport from "passport";
import session from "express-session";
import connectMongo from "connect-mongodb-session";

import mergedTypeDefs from "./typeDefs/index.js";
import mergedResolvers from "./resolvers/index.js";

import { connectDB } from "./db/connectDB.js";

import { configurePassport } from "./passport/passport.config.js";

dotenv.config();
configurePassport();

const app = express();
const httpServer = http.createServer(app)

const MongoDBStore = connectMongo(session)
const store = new MongoDBStore({
    uri: process.env.MONGOD_URI,
    collection: "session"
})
store.on("error", (err) => console.log(err))

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 7,
            httpOnly:true
        },
        store:store
    })
)

app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer({
    typeDefs: mergedTypeDefs,
    resolvers: mergedResolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
});


await server.start();

app.use("/",
    cors({
        origin: "http://localhost:3000",
        credentials:true
    }),
    express.json(),
    expressMiddleware(server, {
        context: async ({ req }) => ({ req }),
    }) 
)

await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));
await connectDB()
// const { url } = await startStandaloneServer(server)

// console.log(`server ready at ${url}`)