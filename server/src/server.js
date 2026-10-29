import "dotenv/config"; //Load environment variables first

import express from "express";
import cors from "cors";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";

import pool from "./config/db.js";

import recipeRoutes from "./routes/recipeRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import plannerRoutes from "./routes/plannerRoutes.js";
import shoppingRoutes from "./routes/shoppingRoutes.js";
import pantryRoutes from "./routes/pantryRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

const app = express();

const PORT = process.env.PORT || 3000;

const PgSession = connectPgSimple(session);

const isProduction = process.env.NODE_ENV === "production";

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

if (isProduction) {
  app.set("trust proxy", 1);
}

app.use(
  cors({
    origin: clientUrl,
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    store: new PgSession({
      pool,
      tableName: "user_sessions",
      createTableIfMissing: true,
    }),

    name: "familyMealPlannerSession",

    secret: process.env.SESSION_SECRET,

    resave: false,
    saveUninitialized: false,

    cookie: {
      httpOnly: true,

      secure: isProduction,

      sameSite: isProduction ? "none" : "lax",

      maxAge: 1000 * 60 * 60 * 24,
    },
  }),
);

app.use("/api/auth", authRoutes);

app.use("/api/recipes", recipeRoutes);

app.use("/api/planner", plannerRoutes);

app.use("/api/shopping", shoppingRoutes);

app.use("/api/pantry", pantryRoutes);

app.use("/api/uploads", uploadRoutes);

app.get("/api/test", (req, res) => {
  res.json({
    message: "Family Meal Planner API is running",
  });
});

app.get("/api/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Database connection successful",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      message: "Database connection failed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
