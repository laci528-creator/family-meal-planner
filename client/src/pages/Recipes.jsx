import { useEffect, useState } from "react";
import api from "../services/api";
import RecipeCard from "../components/RecipeCard";

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  if (loading) {
    return <p>Loading recipes...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="recipes-page">
      <h1>My Recipes</h1>

      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
          />
        ))}
      </div>
    </div>
  );
}

export default Recipes;