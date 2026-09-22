import bcrypt from "bcrypt";
import pool from "../config/db.js";


export async function registerUser(req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        error: true,
        message: "Invalid input.",
      });
    }

    const cleanFirstName = firstName.trim();
    const cleanLastName = lastName.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (!cleanFirstName || !cleanLastName || !normalizedEmail || !password) {
      return res.status(400).json({
        error: true,
        message: "All fields are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: true,
        message: "Password must be at least 8 characters long.",
      });
    }

    const existingUser = await pool.query(
      "SELECT id FROM users WHERE LOWER(email) = $1",
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        error: true,
        message: "An account with this email already exists.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
        INSERT INTO users (
          first_name,
          last_name,
          email,
          password_hash
        )
        VALUES ($1, $2, $3, $4)
        RETURNING
          id,
          first_name,
          last_name,
          email,
          role,
          created_at
      `,
      [
        cleanFirstName,
        cleanLastName,
        normalizedEmail,
        passwordHash,
      ]
    );

    return res.status(201).json({
      error: false,
      message: "Account created successfully.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      error: true,
      message: "Server error.",
    });
  }
}


export async function loginUser(req, res) {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        error: true,
        message: "Invalid input.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        error: true,
        message: "Email and password are required.",
      });
    }

    const result = await pool.query(
      `
        SELECT
          id,
          first_name,
          last_name,
          email,
          password_hash,
          role,
          created_at
        FROM users
        WHERE LOWER(email) = $1
      `,
      [normalizedEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: true,
        message: "Invalid email or password.",
      });
    }

    const user = result.rows[0];

    const passwordMatches = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!passwordMatches) {
      return res.status(401).json({
        error: true,
        message: "Invalid email or password.",
      });
    }

    

    req.session.regenerate((error) => {
      if (error) {
        console.error("Session regeneration error:", error);

        return res.status(500).json({
          error: true,
          message: "Login failed.",
        });
      }

      req.session.user = {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        role: user.role,
      };

      return res.status(200).json({
        error: false,
        message: "Login successful.",
        user: req.session.user,
      });
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      error: true,
      message: "Server error.",
    });
  }
}

export function getCurrentUser(req, res) {
  if (!req.session.user) {
    return res.status(401).json({
      error: true,
      message: "Not authenticated.",
    });
  }

  return res.status(200).json({
    error: false,
    user: req.session.user,
  });
}

export function logoutUser(req, res) {
  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        error: true,
        message: "Logout failed.",
      });
    }

    res.clearCookie("connect.sid");

    return res.status(200).json({
      error: false,
      message: "Logout successful.",
    });
  });
}