import {
  COOKIE_NAME,
  EXTERNAL_TOKEN_PREFIX,
  ORDER_NOT_FOUND,
  RESPONSE_TO_USER,
  __dbname__,
  __dbpassword__,
  __dbusername__,
  __prod__,
  __secret__,
} from "./constants";
import { createUserLoader } from "./utils/createUserLoader";
import { createConnection, getConnection } from "typeorm";
import { OrderProduct } from "./entities/OrderProduct";
import { ProductResolver } from "./resolvers/product";
import { ApolloServer } from "apollo-server-express";
import { OrderResolver } from "./resolvers/order";
import { UserResolver } from "./resolvers/User";
import { Product } from "./entities/Product";
import { buildSchema } from "type-graphql";
import connectRedis from "connect-redis";
import { Order } from "./entities/Order";
import { Price } from "./entities/Price";
import { User } from "./entities/User";
import session from "express-session";
import bodyParser from "body-parser";
import { MyContext } from "./types";
import express from "express";
import Redis from "ioredis";
import "reflect-metadata";
import path from "path";
import cors from "cors";
import { getThaiPostAuth } from "./utils/getThaiPostAuth";
import { PostalService } from "./entities/PostalService";
import { SocialMedia } from "./entities/SocialMedia";

require("dotenv").config();

const main = async () => {
  const conn = createConnection({
    type: "postgres",
    database: __dbname__,
    username: __dbusername__,
    password: __dbpassword__,
    logging: true,
    synchronize: true,
    migrations: [path.join(__dirname, "./migrations/*")],
    entities: [
      User,
      Order,
      OrderProduct,
      Product,
      Price,
      PostalService,
      SocialMedia,
    ],
  });

  (await conn).runMigrations();

  const app = express();

  const RedisStore = connectRedis(session);
  const redis = new Redis();

  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );

  app.use(
    session({
      name: COOKIE_NAME,
      store: new RedisStore({ client: redis, disableTouch: true }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 30, // 1 month
        httpOnly: true,
        sameSite: "lax", // csrf
        secure: __prod__, // require https
      },
      resave: false,
      saveUninitialized: false,
      secret: __secret__,
    })
  );

  app.use(bodyParser.json());

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [UserResolver, OrderResolver, ProductResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({
      req,
      res,
      redis,
      userLoader: createUserLoader(),
    }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("server running on port 4000");
  });

  app.post("/facebook/webhook", (req, res) => {
    let body = req.body;

    if (body.object === "page") {
      body.entry.forEach(async (entry: any) => {
        let webhook_event = entry.messaging[0];
        let customer_acc = webhook_event?.sender?.id;
        let message = webhook_event?.message.toLowerCase();
        if (message.includes("order#") || message.includes("order #")) {
          if (customer_acc) {
            let m = message.split("#");
            let orderId = m[1].trim();

            const orderExist = await Order.findOne(orderId);
            let responseText = orderExist ? RESPONSE_TO_USER : ORDER_NOT_FOUND;

            // save to db
            const order = await getConnection().query(
              `update "order" set customer_acc = ${customer_acc} where id = ${parseInt(
                orderId
              )}`
            );

            // subscribe to postal service
            let token;
            const oldToken = await redis.get(
              EXTERNAL_TOKEN_PREFIX + process.env.TP_TOKEN
            );
            if (!oldToken) {
              const newToken = await getThaiPostAuth();
              if (!newToken) {
                return;
              }
              await redis.set(
                EXTERNAL_TOKEN_PREFIX + process.env.TP_TOKEN,
                newToken,
                "ex",
                1000 * 60 * 60 * 24 * 30 // 30 days
              );

              token = newToken ? newToken : oldToken;
            }

            await fetch(`${process.env.TP_HOOK_ENDPOINT}`, {
              method: "POST",
              headers: {
                Authorization: `Token ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                status: "all",
                language: "TH",
                barcode: [order[0].trackingNumber],
              }),
            });

            // reply customer
            let responseToUser = {
              messaging_type: "RESPONSE",
              recipient: {
                id: customer_acc,
              },
              message: {
                text: responseText,
              },
            };

            await fetch(
              `${process.env.FB_AUTH_ENDPOINT}${process.env.FB_PAGE_TOKEN}`,
              {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: JSON.stringify(responseToUser),
              }
            );
          }
        }
      });

      res.status(200).send("EVENT_RECEIVED");
    } else {
      res.sendStatus(404);
    }
  });

  app.get("/facebook/webhook", (req, res) => {
    let VERIFY_TOKEN = process.env.FB_PAGE_TOKEN;

    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];

    if (mode && token) {
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  });
};

main().catch((err) => {
  console.error(err);
});
