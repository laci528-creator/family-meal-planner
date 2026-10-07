import pool from '../config/db.js';
import { isValidISODate, getEndDate } from '../utils/dateUtils.js';

export async function getShoppingList(req, res) {

        const { startDate } = req.query;

        const userId = req.session.user.id;

        if (!isValidISODate(startDate)) {
            return res.status(400).json({
                error: true,
                message: "Invalid start date. Please provide a valid date in YYYY-MM-DD format.",
            });
        }

        const endDate = getEndDate(startDate);

        try {

            const shoppingListQuery = await pool.query(
                `
                SELECT mpe.recipe_id, ri.ingredient_id, ri.measure, i.name
                FROM meal_plan_entries mpe

                JOIN recipe_ingredients ri ON mpe.recipe_id = ri.recipe_id

                JOIN ingredients i ON ri.ingredient_id = i.id

                WHERE mpe.user_id = $1
                    AND mpe.plan_date BETWEEN $2 AND $3

                order by mpe.recipe_id
                `,
                [userId, startDate, endDate]
            );

            const shoppingList = shoppingListQuery.rows.map(row => ({
                recipeId: row.recipe_id,
                ingredientId: row.ingredient_id,
                measure: row.measure,
                name: row.name
            }));

            res.status(200).json({
                error: false,
                message: "Shopping list fetched successfully.",
                startDate,
                endDate,
                shoppingList: shoppingList
            });

        } catch (error) {
            console.error("Error fetching shopping list:", error);
            res.status(500).json({
                error: true,
                message: "Internal server error.",
            });
    } 
}

export async function generateShoppingList(req, res) { 

        const { startDate } = req.query;

        const userId = req.session.user.id;

        if (!isValidISODate(startDate)) {
            return res.status(400).json({
                error: true,
                message: "Invalid start date. Please provide a valid date in YYYY-MM-DD format.",
            });
        }

        const endDate = getEndDate(startDate);

        let client;

        try {
            client = await pool.connect();

            await client.query('BEGIN');



        const shoppingListQuery = await client.query(
                `
                SELECT 
                    mpe.id AS meal_plan_entry_id,
                    mpe.recipe_id, 
                    ri.ingredient_id, 
                    ri.measure, 
                    i.name
                FROM meal_plan_entries mpe

                JOIN recipe_ingredients ri ON mpe.recipe_id = ri.recipe_id

                JOIN ingredients i ON ri.ingredient_id = i.id

                WHERE mpe.user_id = $1
                    AND mpe.plan_date BETWEEN $2 AND $3

                order by mpe.recipe_id
                `,
                [userId, startDate, endDate]
            );


            const shoppingList = shoppingListQuery.rows.map(row => ({
                mealPlanEntryId: row.meal_plan_entry_id,
                recipeId: row.recipe_id,
                ingredientId: row.ingredient_id,
                measure: row.measure,
                name: row.name
            }));

        await client.query(
            `
                DELETE FROM shopping_list_items
                WHERE user_id = $1
                AND week_start = $2
                AND source = 'planner'
            `,
            [userId, startDate]
        );


    for (const item of shoppingList) {

        const { mealPlanEntryId, ingredientId, measure, name } = item;
        
        const insertShoppingListQuery = await client.query(
            `
            INSERT INTO shopping_list_items (
                user_id,
                meal_plan_entry_id,
                ingredient_id,
                week_start,
                name,
                measure,
                status,
                source
            )
            VALUES ($1, $2, $3, $4, $5, $6, 'needed', 'planner')
            RETURNING id
            `,
            [userId, mealPlanEntryId, ingredientId, startDate, name, measure]
        );

    }

            await client.query('COMMIT');

            res.status(200).json({
                error: false,
                message: "Shopping list generated successfully.",
                startDate,
                endDate,
                shoppingList,
            }); 

        } catch (error) {
            if (client) {
                await client.query('ROLLBACK');
            }   
            console.error("Error generating shopping list:", error);
            res.status(500).json({
                error: true,
                message: "Internal server error.",
            });
        } finally {
            if (client) {
                client.release();
            }
    }
}