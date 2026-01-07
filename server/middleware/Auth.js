import jwt from "jsonwebtoken";

export const authCheck = (req) => {
  const header = req.headers.authorization || "";
  if (!header) return null;

  try {
    const token = header.replace("Bearer ", "");
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};
