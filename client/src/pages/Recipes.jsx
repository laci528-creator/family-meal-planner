import { useEffect, useState } from "react";
import api from "../services/api";
import RecipeCard from "../components/RecipeCard";
import StatusMessage from "../components/StatusMessage";

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleRecipeDeleted(recipeId) {
    setRecipes((currentRecipes) =>
      currentRecipes.filter(
        (recipe) => recipe.id !== recipeId
      )
    );

    setMessage("Recipe deleted successfully.");

    setTimeout(() => {
      setMessage("");
    }, 3000);
  }

  useEffect(() => {
    async function fetchRecipes() {
      try {
        setError("");
        
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
    <main className="page-container recipes-page">
      <h1 className="page-title">My Recipes</h1>

      <StatusMessage type="success">
        {message}
      </StatusMessage>

      <StatusMessage type="info">
        {loading ? "Loading recipes..." : null}
      </StatusMessage>

      <StatusMessage type="error">
        {error}
      </StatusMessage>

      {!loading && !error && recipes.length === 0 && (
        <StatusMessage type="info">
          No saved recipes yet. Start exploring and save your favorite recipes.
        </StatusMessage>
      )}

      {!loading && !error && recipes.length > 0 && (
        <div className="recipes-grid">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onDeleted={handleRecipeDeleted}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default Recipes; 