import pool from '../config/db.js';


export async function getPantryList(req,res) {

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
                pantryList:pantryListQuery.rows,
            });

        } catch(error) {
            console.error("Error fetching pantry list:", error);
            res.status(500).json({
                error: true,
                message: "Could not load pantry list. Please try again later.",
            });
        }
}