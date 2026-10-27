import { useState } from "react";
import api from "../services/api";
import ApiRecipeCard from "../components/ApiRecipeCard";
import StatusMessage from "../components/StatusMessage";


function DiscoverRecipes() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);


  async function handleSearch(event) {
    event.preventDefault();

    setError("");
    setRecipes([]);

    const trimmedSearchTerm = query.trim();

    if (!trimmedSearchTerm) {
      setError("Please enter a search term.");
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {

      const response = await api.get("/recipes/search", {
        params: {
          q: trimmedSearchTerm,
        },
      });

      setRecipes(response.data.recipes);

    } catch (error) {
      console.error("Frontend error:", error);
      setError(
        error.response?.data?.message ||
        "Could not search recipes."
      );
    }
    finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-container discover-recipes-page">
      <h1 className="page-title">Discover Recipes</h1>

      <StatusMessage type="info">
        {loading ? "Searching recipes..." : null}
      </StatusMessage>

      <StatusMessage type="error">
        {error}
      </StatusMessage>

      {hasSearched &&
        !loading &&
        !error &&
        recipes.length === 0 && (
          <StatusMessage type="info">
            No recipes found.
          </StatusMessage>
        )}

      <form onSubmit={handleSearch} className="recipe-search-form">
        <input
          type="text"
          className="recipe-search-input"
          placeholder="Search for recipe..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </form>

      <div className="recipes-grid">
        {recipes.map((recipe) => (
          <ApiRecipeCard
            key={recipe.externalId}
            recipe={recipe}
          />
        ))}
      </div>
    </main>
  );
}

export default DiscoverRecipes; 