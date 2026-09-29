import { useState } from "react";
import api from "../services/api";
import ApiRecipeCard from "../components/ApiRecipeCard";


function DiscoverRecipes() {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  async function handleSearch(event) {
    event.preventDefault();
    
    setError("");

    const trimmedSearchTerm = query.trim();

    if (!trimmedSearchTerm) {
      setError("Please enter a search term.");
      return;
    }

    setLoading(true);

    try {

        const response = await api.get(`/recipes/search?q=${trimmedSearchTerm}`);

        setRecipes(response.data.recipes);

    } catch (error) {
        console.error("Frontend error:", error);
        setError(error.message);
    }
    finally {
        setLoading(false);
    }
  }

  return (
    <main className="discover-recipes-page">
      <h1>Discover Recipes</h1>
      {loading && <p>Loading recipe...</p>}

      {error && <p className="error-message">{error}</p>}

      {!loading && !error && recipes.length === 0 && query && (
        <p>No recipes found.</p>
        )}

        <form onSubmit={handleSearch} className="recipe-search-form"> 
            <input 
                type="text" 
                className="recipe-search-input"
                placeholder="Search for recipe..." 
                value={query} 
                onChange={(event) => setQuery(event.target.value)} 
                /> 
                <button type="submit" className="primary-button" disable={loading}>{loading ? "Searching..." : "Search"}</button>
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