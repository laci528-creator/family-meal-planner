import pool from '../config/db.js';
import { capitalizeFirstLetter } from "../utils/stringUtils.js";

export async function getPantryList(req, res) {

    const userId = req.session.user.id;

    try {

        const pantryListQuery = await pool.query(
            `
                SELECT id, name
                FROM pantry_staples
                WHERE user_id = $1
                ORDER BY name ASC
                `,
            [userId]
        );

        res.status(200).json({
            error: false,
            message: "Pantry list fetched successfully.",
            pantryList: pantryListQuery.rows,
        });

    } catch (error) {
        console.error("Error fetching pantry list:", error);
        res.status(500).json({
            error: true,
            message: "Could not load pantry list. Please try again later.",
        });
    }
}

export async function addItemForPantry(req, res) {

    const userId = req.session.user.id;

    const { name } = req.body;

    if (
        typeof name !== "string" ||
        name.trim() === ""
    ) {
        return res.status(400).json({
            error: true,
            message: "Pantry item name is required.",
        });
    }

    const formattedName =
        capitalizeFirstLetter(name);

    try {
        const result = await pool.query(
            `
      INSERT INTO pantry_staples (
        user_id,
        name
      )
      VALUES ($1, $2)
      RETURNING id, name
    `,
            [userId, formattedName]
        );

        return res.status(201).json({
            error: false,
            message: "Pantry item added successfully.",
            item: result.rows[0],
        });

    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                error: true,
                message: "This item is already in your pantry.",
            });
        }

        console.error("Add pantry item error:", error);

        return res.status(500).json({
            error: true,
            message: "Could not add pantry item.",
        });
    }
}


export async function deletePantryItem(req, res) {
    const { id } = req.params;
    const userId = req.session.user.id;

    if (!/^\d+$/.test(id)) {
        return res.status(400).json({
            error: true,
            message: "Invalid pantry item ID.",
        });
    }

    try {
        const result = await pool.query(
            `
        DELETE FROM pantry_staples
        WHERE id = $1
          AND user_id = $2
        RETURNING id, name
      `,
            [id, userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: true,
                message: "Pantry item not found.",
            });
        }

        return res.status(200).json({
            error: false,
            message: "Pantry item deleted successfully.",
            item: result.rows[0],
        });

    } catch (error) {
        console.error("Delete pantry item error:", error);

        return res.status(500).json({
            error: true,
            message: "Could not delete pantry item.",
        });
    }
}