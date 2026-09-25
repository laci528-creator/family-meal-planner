import pool from '../config/db.js';
import { fetchRecipeById } from "../services/recipeApiService.js";

export async function getRandomRecipe(req, res) {
  try {
    const response = await fetch(
      "https://www.themealdb.com/api/json/v1/1/random.php"
    );

    if (!response.ok) {
      throw new Error("Recipe API request failed.");
    }

    const data = await response.json();
    const meal = data.meals?.[0];

    if (!meal) {
      return res.status(404).json({
        error: true,
        message: "Recipe not found.",
      });
    }

    return res.status(200).json({
      error: false,
      recipe: {
        externalId: meal.idMeal,
        title: meal.strMeal,
        category: meal.strCategory,
        cuisine: meal.strArea,
        image: meal.strMealThumb,
      },
    });
  } catch (error) {
    console.error("Random recipe error:", error);

    return res.status(500).json({
      error: true,
      message: "Could not load recipe.",
    });
  }
}

export async function getRecipeById(req, res) {
  try {
    const { id } = req.params;

    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
    );

    if (!response.ok) {
      throw new Error("Recipe API request failed.");
    }

    const data = await response.json();
    const meal = data.meals?.[0];

    if (!meal) {
      return res.status(404).json({
        error: true,
        message: "Recipe not found.",
      });
    }

    const ingredients = [];

    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}`];
      const measure = meal[`strMeasure${i}`];

      if (ingredient && ingredient.trim()) {
        ingredients.push({
          name: ingredient.trim(),
          measure: measure?.trim() || "",
        });
      }
    }

    return res.status(200).json({
      error: false,
      recipe: {
        externalId: meal.idMeal,
        title: meal.strMeal,
        category: meal.strCategory,
        cuisine: meal.strArea,
        image: meal.strMealThumb,
        instructions: meal.strInstructions,
        ingredients,
        source: meal.strSource,
        youtube: meal.strYoutube,
      },
    });
  } catch (error) {
    console.error("Recipe details error:", error);

    return res.status(500).json({
      error: true,
      message: "Could not load recipe.",
    });
  }
}


export async function saveRecipe(req, res) {

        const { externalId } = req.body;

        if (
          typeof externalId !== "string" ||
          !/^\d+$/.test(externalId)
        ) {
          return res.status(400).json({
            error: true,
            message: "Invalid recipe ID.",
          });
        }

        const userId = req.session.user.id;

        let client;

        try {

            const recipe = await fetchRecipeById(externalId);
                if (!recipe) {
                  return res.status(404).json({
                    error: true,
                    message: "Recipe not found.",
                  });
                }

                client = await pool.connect();

                await client.query("BEGIN");


            const recipeSaveResult = await client.query(
              ` INSERT INTO recipes (
                user_id,
                external_id,
                title,
                category, 
                cuisine,
                instructions,
                image_url,
                source
              ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id `,
                [
                  userId, 
                  recipe.externalId, 
                  recipe.title, 
                  recipe.category, 
                  recipe.cuisine, 
                  recipe.instructions, 
                  recipe.image, 
                  "api"
                ]
            );

          
            const recipeId = recipeSaveResult.rows[0].id;

                for (const ingredient of recipe.ingredients) {
                  const ingredientName = ingredient.name.trim();
                  let ingredientResult = await client.query (
                    `SELECT id FROM ingredients WHERE LOWER(name) = LOWER($1) `, [ingredientName]
                  );

                  if (ingredientResult.rows.length === 0) {
                    ingredientResult = await client.query (
                    `INSERT INTO ingredients (name) VALUES ($1) RETURNING id `, [ingredientName]
                    );
                  }

                  const ingredientId = ingredientResult.rows[0].id;

                  await client.query(
                    `INSERT INTO recipe_ingredients (recipe_id, ingredient_id, measure) VALUES ($1, $2, $3) ` ,
                    [recipeId, ingredientId, ingredient.measure]
                  );
                }

            await client.query('COMMIT');

            return res.status(201).json({
              error: false,
              message: "Recipe successfully saved in database!",
              recipeId,
            });

        } catch (error) {
          if (client) {
            await client.query("ROLLBACK");
          }

          console.error("Save recipe error:", error);

          if (error.code === "23505" && error.constraint === "recipes_user_external_unique") {
            return res.status(409).json({
              error: true,
              message: "This recipe is already saved.",
              errorCode: "RECIPE_ALREADY_EXISTS"
            });
          }


          return res.status(500).json({
            error: true,
            message: "Could not save recipe.",
          });
        } finally {
          client?.release();
    }
}

