import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Joi from "joi";
import { db } from "../db/index.js";
import { verifyCsrf } from "../middleware/csrf.js";
import { requireAuth } from "../middleware/auth.js";
import { JWT_EXPIRES_MINUTES, JWT_SECRET } from "../server.js";

const router = express.Router();

const credentialsSchema = Joi.object({
  email: Joi.string().email().max(255).required(),
  password: Joi.string().min(6).max(200).required(),
});

router.post("/register", verifyCsrf, async (req, res) => {
  const { error, value } = credentialsSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });
  const { email, password } = value;

  const existing = await db.findUserByEmail(email);
  if (existing) return res.status(409).json({ error: "Email already registered" });

  const hash = await bcrypt.hash(password, 12);
  await db.createUser(email, hash);
  return res.status(201).json({ message: "Registered" });
});

router.post("/login", verifyCsrf, async (req, res) => {
  console.log("login-path");
  const { error, value } = credentialsSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.message });

  const { email, password } = value;
  const user = await db.findUserByEmail(email);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ email }, JWT_SECRET, { subject: String(user._id), expiresIn: `${JWT_EXPIRES_MINUTES}m` });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
    maxAge: Number(JWT_EXPIRES_MINUTES) * 60 * 1000,
    path: "/",
  });
  const expSeconds = Math.floor(Date.now() / 1000) + Number(JWT_EXPIRES_MINUTES) * 60;
  return res.json({ message: "Logged in", exp: expSeconds, email });
});

router.get("/me", requireAuth, (req, res) => {
  return res.json({ email: req.user.email, exp: req.user.exp });
});

router.post("/logout", verifyCsrf, (req, res) => {
  res.clearCookie("token", { path: "/" });
  return res.json({ message: "Logged out" });
});

export default router;
