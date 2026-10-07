import pool from '../config/db.js';
import { isValidISODate, getEndDate } from '../utils/dateUtils.js';


export async function checkUserRecipe(recipeId, userId) {

    try {
        const result = await pool.query(
            `SELECT id FROM recipes 
            WHERE id = $1
                AND user_id = $2`,
            [recipeId, userId]
        );

        return result.rows.length > 0;

    } catch (error) {
        console.error("Error checking recipe ID:", error);
        throw error;
    } 
}


export async function savePlannerData(req, res) {

        const { 
            recipeId,
            planDate,
            mealType,
         } = req.body;

        const userId = req.session.user.id;

        if (
            !Number.isInteger(recipeId) ||
            recipeId <= 0
            ) {
                return res.status(400).json({
                    error: true,
                    message: "Invalid recipe ID.",
                });
        }

        if (!isValidISODate(planDate)) {
            return res.status(400).json({
                error: true,
                message: "Invalid plan date. Please provide a valid date in YYYY-MM-DD format.",
            });
        }

        const allowedMealTypes = ["breakfast", "lunch", "dinner"];

        if (!allowedMealTypes.includes(mealType)) {
            return res.status(400).json({
                error: true,
                message: "Invalid meal type.",
            });
        }   

        let client;

        try {

            const recipeExists = await checkUserRecipe(
                    recipeId,
                    userId
                    );

                    if (!recipeExists) {
                    return res.status(404).json({
                        error: true,
                        message: "Recipe not found.",
                    });
                }

            client = await pool.connect();

            await client.query("BEGIN");

            const planSaveResult = await client.query(
              ` INSERT INTO meal_plan_entries (
                user_id,
                recipe_id,
                plan_date,
                meal_type
              ) VALUES ($1, $2, $3, $4) 
               
              ON CONFLICT (user_id, plan_date, meal_type) 
              DO UPDATE SET
                recipe_id = EXCLUDED.recipe_id
              
              RETURNING id `,
                [
                  userId,
                  recipeId,
                  planDate,
                  mealType
                ]
            );

            const plannerEntryId = planSaveResult.rows[0].id;


            await client.query('COMMIT');

            return res.status(200).json({
              error: false,
              message: "Meal plan successfully saved!",
              plannerEntryId,
            });

        } catch (error) {
          if (client) {
            await client.query("ROLLBACK");
          }

          console.error("Save meal plan error:", error);

          return res.status(500).json({
            error: true,
            message: "Could not save meal plan.",
          });
        } finally {
          client?.release();
    }
}


export async function getWeeklyPlannerData(req, res) {
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

            const weeklyPlannerResult = await pool.query(
              ` SELECT
                    mpe.id AS planner_entry_id,
                    mpe.recipe_id,
                    mpe.plan_date::text AS plan_date,
                    mpe.meal_type,
                    r.title,
                    r.image_url 
                FROM meal_plan_entries mpe
                JOIN recipes r
                    ON r.id = mpe.recipe_id
                WHERE mpe.user_id = $1 AND mpe.plan_date BETWEEN $2 AND $3 
                order by mpe.plan_date ASC`,
                [
                  userId,
                  startDate,
                  endDate
                ]
            );
            
            return res.status(200).json({
              error: false,
              message: "Weekly planner data retrieved successfully!",
              weeklyPlannerData: weeklyPlannerResult.rows,
            });
    } catch (error) {
          console.error("Retrieve weekly planner data error:", error);

          return res.status(500).json({
            error: true,
            message: "Could not retrieve weekly planner data.",
          });
    } 
}

export async function deletePlannerEntry(req, res) {
  const { id } = req.params;
  const userId = req.session.user.id;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      error: true,
      message: "Invalid planner entry ID.",
    });
  }

  try {
    const result = await pool.query(
      `
        DELETE FROM meal_plan_entries
        WHERE id = $1
          AND user_id = $2
        RETURNING id
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Planner entry not found.",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Meal successfully deleted from planner.",
    });

  } catch (error) {
    console.error("Delete planner entry error:", error);

    return res.status(500).json({
      error: true,
      message: "Could not delete meal from planner.",
    });
  }
}