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
