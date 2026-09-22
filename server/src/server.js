import "dotenv/config";  //Load environment variables first
import express from "express";
import cors from "cors";
import session from "express-session";
import pool from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";


const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,  //just in localhost
    sameSite: "lax",
    maxAge: 1000 * 60 * 60 * 24,
  },
}));


app.use("/api/auth", authRoutes);

app.get("/api/test", (req, res) => {
  res.json({
    message: "Family Meal Planner API is running"
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