import pool from '../config/db.js';
import { fetchRecipeById, searchRecipesByName } from "../services/recipeApiService.js";

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


export async function checkRecipeSaved(req, res) {
  const { externalId } = req.params;
  const userId = req.session.user.id;

  try {
    const result = await pool.query(
      `
        SELECT id
        FROM recipes
        WHERE user_id = $1
          AND external_id = $2
          AND source = 'api'
        LIMIT 1
      `,
      [userId, externalId]
    );

    return res.status(200).json({
      error: false,
      saved: result.rows.length > 0, //true
    });
  } catch (error) {
    console.error("Check saved recipe error:", error);

    return res.status(500).json({
      error: true,
      message: "Could not check recipe status.",
    });
  }
}



export async function getSavedRecipes(req,res) {
  const userId = req.session.user.id;

  try {
        const result = await pool.query(
      `
        SELECT
          id,
          external_id,
          title,
          category,
          cuisine,
          image_url,
          source,
          created_at
        FROM recipes
        WHERE user_id = $1
        ORDER BY created_at DESC
      `,
      [userId]
    );

    return res.status(200).json({
      error:false,
      recipes: result.rows,
    });

  } catch (error) {
    console.error("Error loading saved recipes:", error);
     return res.status(500).json({
      error: true,
      message: "Could not load recipes.",
    });
  }
}

export async function getSavedRecipeById(req, res) {
  const { id } = req.params;
  const userId = req.session.user.id;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      error: true,
      message: "Invalid recipe ID.",
    });
  }

  try {
    const recipeResult = await pool.query(
      `
        SELECT
          id,
          external_id,
          title,
          category,
          cuisine,
          instructions,
          image_url,
          source,
          created_at
        FROM recipes
        WHERE id = $1
          AND user_id = $2
      `,
      [id, userId]
    );

    if (recipeResult.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Recipe not found.",
      });
    }

    const ingredientsResult = await pool.query(
      `
        SELECT
          i.id,
          i.name,
          ri.measure
        FROM recipe_ingredients ri
        JOIN ingredients i
          ON i.id = ri.ingredient_id
        WHERE ri.recipe_id = $1
        ORDER BY ri.id
      `,
      [id]
    );

    return res.status(200).json({
      error: false,
      recipe: {
        ...recipeResult.rows[0],
        ingredients: ingredientsResult.rows,
      },
    });

  } catch (error) {
    console.error("Error loading saved recipe:", error);

    return res.status(500).json({
      error: true,
      message: "Could not load recipe.",
    });
  }
}

export async function deleteRecipe(req, res) {
  const { id } = req.params;
  const userId = req.session.user.id;

  if (!/^\d+$/.test(id)) {
    return res.status(400).json({
      error: true,
      message: "Invalid recipe ID.",
    });
  }

  try {
    const result = await pool.query(
      `
        DELETE FROM recipes
        WHERE id = $1
          AND user_id = $2
        RETURNING id
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Recipe not found.",
      });
    }

    return res.status(200).json({
      error: false,
      message: "Recipe deleted.",
    });

  } catch (error) {
    console.error("Delete recipe error:", error);

    return res.status(500).json({
      error: true,
      message: "Could not delete recipe.",
    });
  }
}

export async function searchRecipes(req, res) {
  const query = req.query.q?.trim();

  if (!query) {
    return res.status(400).json({
      error: true,
      message: "Search query is required.",
    });
  }

  try {
    const recipes = await searchRecipesByName(query);

    return res.status(200).json({
      error: false,
      recipes,
    });
  } catch (error) {
    console.error("Recipe search error:", error);

    return res.status(500).json({
      error: true,
      message: "Could not search recipes.",
    });
  }
}


export async function saveFamilyRecipe(req, res) {

    const {
    title,
    category,
    cuisine,
    instructions,
    imageUrl,
    ingredients,
  } = req.body;

  const userId = req.session.user.id;

    if (
      typeof title !== "string" ||
      !title.trim() ||
      typeof instructions !== "string" ||
      !instructions.trim()
    ) {
      return res.status(400).json({
        error: true,
        message: "Title and instructions are required.",
      });
    }

      if (!Array.isArray(ingredients)) {
        return res.status(400).json({
          error: true,
          message: "Ingredients must be a list.",
        });
      }

      const validIngredients = ingredients.filter(
        (ingredient) =>
          typeof ingredient.name === "string" &&
          ingredient.name.trim() !== ""
      );

      if (validIngredients.length === 0) {
        return res.status(400).json({
          error: true,
          message: "At least one ingredient is required.",
        });
      }

    let client;

      try {

          client = await pool.connect();

          await client.query("BEGIN");

          const recipeSaveResult = await client.query(
                ` INSERT INTO recipes (
                  user_id,
                  title,
                  category, 
                  cuisine,
                  instructions,
                  image_url,
                  source
                ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id `,
                  [
                  userId,
                  title.trim(),
                  category?.trim() || null,
                  cuisine?.trim() || null,
                  instructions.trim(),
                  imageUrl?.trim() || null,
                    "custom"
                  ]
              );

              const recipeId = recipeSaveResult.rows[0].id;

              for (const ingredient of ingredients) {
                    const ingredientName =
                      typeof ingredient.name === "string"
                        ? ingredient.name.trim()
                        : "";

                    if (!ingredientName) {
                      continue;
                    }

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
                      [recipeId, ingredientId, ingredient.measure?.trim() || null,]
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

            return res.status(500).json({
              error: true,
              message: "Could not save recipe.",
            });

        } finally {
          client?.release();
      }
}