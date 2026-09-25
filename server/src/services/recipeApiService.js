export async function fetchRecipeById(externalId) {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${externalId}`
  );

  if (!response.ok) {
    throw new Error("Recipe API request failed.");
  }

  const data = await response.json();
  const meal = data.meals?.[0];

  if (!meal) {
    return null;
  }

  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];

    if (ingredient?.trim()) {
      ingredients.push({
        name: ingredient.trim(),
        measure: measure?.trim() || "",
      });
    }
  }

  return {
    externalId: meal.idMeal,
    title: meal.strMeal,
    category: meal.strCategory,
    cuisine: meal.strArea,
    instructions: meal.strInstructions,
    image: meal.strMealThumb,
    ingredients,
  };
}