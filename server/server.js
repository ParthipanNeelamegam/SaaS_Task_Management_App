import express from "express";
import { graphqlHTTP } from "express-graphql";
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import cors from "cors";

import schema from "./graphQL/schema.js";
import root from "./graphQL/typeDef.js";
import User from "./models/User.js";

const app = express();
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

app.use(express.json());

app.use(
  "/graphql",
  graphqlHTTP(async (req) => {
    console.log("🔥 GRAPHQL HIT 🔥");

    let user = null;
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      user = await User.findById(decoded.userId);
    }


    return {
      schema,
      rootValue: root,
      context: { user },
      graphiql: true
    };
  })
);


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"));

app.listen(4000, () =>
  console.log("🚀 Server running at http://localhost:4000/graphql")
);
