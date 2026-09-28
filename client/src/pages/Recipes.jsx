import { useEffect, useState } from "react";
import api from "../services/api";
import RecipeCard from "../components/RecipeCard";

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  function handleRecipeDeleted(recipeId) {
  setRecipes((currentRecipes) =>
    currentRecipes.filter(
      (recipe) => recipe.id !== recipeId
    )
  );
}

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await api.get("/recipes");
        setRecipes(response.data.recipes);
      } catch (err) {
        console.error("Could not load recipes:", err);
        setError("Could not load saved recipes.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

  return (
    <main className="recipes-page">
      <h1>My Recipes</h1>

      {loading && <p>Loading recipes...</p>}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}

      {!loading && !error && (
        recipes.length === 0 ? (
          <p>
            No saved recipes yet. Start exploring and save your favorite recipes.
          </p>
        ) : (
          <div className="recipes-grid">
            {recipes.map((recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onDeleted={handleRecipeDeleted}
              />
            ))}
          </div>
        )
      )}
    </main>
  );
}

export default Recipes;