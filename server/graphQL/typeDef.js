import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import User from "../models/User.js";
import Task from "../models/Task.js";

export default {
  signup: async ({ email, password }) => {
    const existing = await User.findOne({ email });
    if (existing) {
      throw new GraphQLError("Email already exists");
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET
    );

    return { token, user };
  },

  login: async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new GraphQLError("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new GraphQLError("Invalid password");

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET
    );

    return { token, user };
  },

  // 🔥 FIXED
  tasks: async (args, context) => {
    const { user } = context;

    if (!user) {
      throw new GraphQLError("Unauthorized", {
        extensions: { code: "UNAUTHENTICATED" }
      });
    }

    // New user → [] (NOT unauthorized)
    return Task.find({ user: user._id });
  },

  // 🔥 FIXED
  addTask: async ({ title }, context) => {
    const { user } = context;

    if (!user) {
      throw new GraphQLError("Unauthorized", {
        extensions: { code: "UNAUTHENTICATED" }
      });
    }

    return Task.create({
      title,
      user: user._id
    });
  },

  deleteTask: async ({ id }, context) => {
    if (!context.user) throw new GraphQLError("Unauthorized");

    await Task.deleteOne({ _id: id, user: context.user._id });
    return true;
  },

  updateTask: async ({ id, status }, context) => {
    const { user } = context;

    if (!user) {
      throw new GraphQLError("Unauthorized");
    }

    return Task.findOneAndUpdate(
      { _id: id, user: user._id },
      { status },
      { new: true }
    );
  }
};
