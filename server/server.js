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

/* =========================
   CORS
========================= */
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true
  })
);

app.use(express.json());

/* =========================
   GRAPHQL
========================= */
app.use(
  "/graphql",
  graphqlHTTP(async (req) => {
    console.log("🔥 GRAPHQL HIT 🔥");

    let user = null;
    const authHeader = req.headers.authorization;

    if (authHeader?.startsWith("Bearer ")) {
      try {
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        user = await User.findById(decoded.userId);
      } catch (err) {
        console.log("❌ Invalid token");
      }
    }

    return {
      schema,
      rootValue: root,
      context: { user },
      graphiql: true
    };
  })
);

/* =========================
   ROOT HEALTH CHECK (OPTIONAL)
========================= */
app.get("/", (req, res) => {
  res.send("🚀 TaskFlow API is running");
});

/* =========================
   DB + SERVER
========================= */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ Mongo Error", err));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
