import "dotenv/config";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.js";
import { issueCsrfToken } from "./middleware/csrf.js";
import { db } from "./db/index.js";

export const { PORT = 4000, NODE_ENV, CLIENT_ORIGIN, MONGO_URI, JWT_SECRET, JWT_EXPIRES_MINUTES = 30, CSRF_COOKIE_NAME = "csrfToken" } = process.env;

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: NODE_ENV === "production" ? undefined : false,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 300 }));

// Issue CSRF cookie for GETs so client can send header on POSTs
app.use(issueCsrfToken);

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);

// Boot
const start = async () => {
  await db.init();
  app.listen(PORT, () => console.log(`API on http://localhost:${PORT} (MongoDB)`));
};
start();
