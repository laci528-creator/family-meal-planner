import pool from '../config/db.js';
import { isValidISODate, getEndDate } from '../utils/dateUtils.js';
import { groupShoppingItems } from "../utils/shoppingUtils.js";

export async function getShoppingList(req, res) {

        const { startDate } = req.query;

        const userId = req.session.user.id;

        if (!isValidISODate(startDate)) {
            return res.status(400).json({
                error: true,
                message: "Invalid start date. Please provide a valid date in YYYY-MM-DD format.",
            });
        }

        try {

            const shoppingListQuery = await pool.query(
                `
                SELECT 
                    id,
                    meal_plan_entry_id AS "mealPlanEntryId",
                    ingredient_id AS "ingredientId",
                    name,
                    measure,
                    status,
                    source
                FROM shopping_list_items
                WHERE user_id = $1
                    AND week_start = $2
                    ORDER BY name ASC
                `,
                [userId, startDate]
            );

            res.status(200).json({
                error: false,
                message: "Shopping list fetched successfully.",
                startDate,
                shoppingList: shoppingListQuery.rows,
            });

        } catch (error) {
            console.error("Error fetching shopping list:", error);
            res.status(500).json({
                error: true,
                message: "Could not load shopping list. Please try again later.",
            });
    } 
}

export async function generateShoppingList(req, res) { 

        const { startDate } = req.body;

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

        const existingItemsQuery = await client.query(
                `
                    SELECT
                    meal_plan_entry_id,
                    ingredient_id,
                    status
                    FROM shopping_list_items
                    WHERE user_id = $1
                    AND week_start = $2
                    AND source = 'planner'
                `,
                [userId, startDate]
                );

        const existingStatuses = new Map();

            for (const item of existingItemsQuery.rows) {
            const key =
                `${item.meal_plan_entry_id}-${item.ingredient_id}`;

                existingStatuses.set(
                    key,
                    item.status
                );
            }

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

        const key =
            `${mealPlanEntryId}-${ingredientId}`;

        const status =
            existingStatuses.get(key) ?? "needed";
        
        await client.query(
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
            VALUES ($1, $2, $3, $4, $5, $6, $7, 'planner')
            `,
            [userId, mealPlanEntryId, ingredientId, startDate, name, measure, status]
        );

    }

            await client.query('COMMIT');

            res.status(201).json({
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
                message: "Could not generate shopping list. Please try again later.",
            });
        } finally {
            if (client) {
                client.release();
            }
    }
}

export async function updateShoppingItemStatus(req, res) {
  const { itemIds, status } = req.body;
  const userId = req.session.user.id;

  const allowedStatuses = [
    "needed",
    "at_home",
    "purchased",
  ];

  if (
    !Array.isArray(itemIds) ||
    itemIds.length === 0 ||
    !itemIds.every(
      (id) => Number.isInteger(id) && id > 0
    )
  ) {
    return res.status(400).json({
      error: true,
      message: "Invalid shopping item IDs.",
    });
  }

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      error: true,
      message: "Invalid shopping item status.",
    });
  }

  try {
    const result = await pool.query(
      `
        UPDATE shopping_list_items
        SET status = $1
        WHERE user_id = $2
          AND id = ANY($3::int[])
        RETURNING id, status
      `,
      [status, userId, itemIds]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Shopping item not found.",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Shopping item status updated.",
      items: result.rows,
    });

  } catch (error) {
    console.error(
      "Update shopping item status error:",
      error
    );

    return res.status(500).json({
      error: true,
      message: "Could not update shopping item status.",
    });
  }
}

export async function removeItemFromShoppingList(req, res) {
  const { itemIds } = req.body;
  const userId = req.session.user.id;

  if (
    !Array.isArray(itemIds) ||
    itemIds.length === 0 ||
    !itemIds.every(
      (id) => Number.isInteger(id) && id > 0
    )
  ) {
    return res.status(400).json({
      error: true,
      message: "Invalid shopping item IDs.",
    });
  }

  try {
    const deleteResult = await pool.query(
      `
        DELETE FROM shopping_list_items
        WHERE user_id = $1
          AND id = ANY($2::int[])
        RETURNING id, name
      `,
      [userId, itemIds]
    );

    if (deleteResult.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Shopping items not found.",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Shopping items deleted successfully.",
      name: deleteResult.rows[0].name,
      deletedItems: deleteResult.rows,
    });

  } catch (error) {
    console.error(
      "Delete shopping item error:",
      error
    );

    return res.status(500).json({
      error: true,
      message: "Could not delete shopping item.",
    });
  }
}


export async function addItemToShoppingList(req,res) {

  const { weekStart, name, measure } = req.body;

  const userId = req.session.user.id;

          if (!isValidISODate(weekStart)) {
            return res.status(400).json({
                error: true,
                message: "Invalid start date. Please provide a valid date in YYYY-MM-DD format.",
            });
        }

          if (
            typeof name !== "string" ||
            name.trim() === ""
          ) {
            return res.status(400).json({
              error: true,
              message: "Shopping item name is required.",
            });
          }

        try {

          const response = await pool.query(
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
            VALUES (
              $1,
              NULL,
              NULL,
              $2,
              $3,
              $4,
              'needed',
              'manual'
            )
            RETURNING           
              id,
              week_start::text AS "weekStart",
              name,
              measure,
              status,
              source;
            `
          , [userId, weekStart, name.trim(), measure?.trim() || null]
        );

        return res.status(201).json({
          error: false,
          message: "Shopping item saved succesfully.",
          item: response.rows[0],
        });

        } catch (error) {
    console.error(
      "Save new shopping item error:",
      error
    );

    return res.status(500).json({
      error: true,
      message: "Could not save new shopping item",
    });
  }

}