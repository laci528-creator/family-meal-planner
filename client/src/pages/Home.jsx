import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import api from "../services/api";

function Home() {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadRandomRecipe() {
      try {
        const response = await api.get("/recipes/random");
        setRecipe(response.data.recipe);
      } catch (err) {
        console.error("Recipe loading error:", err);
        setError("Could not load recipe.");
      } finally {
        setLoading(false);
      }
    }

    loadRandomRecipe();
  }, []);

  return (
    <section className="home-page">
      <div className="home-hero">
        <h1 className="home-title">Plan meals. Shop smarter.</h1>

        <p className="home-description">
          Discover recipes, save family favourites, plan your week
          and create your shopping list automatically.
        </p>
      </div>

      <div className="home-features">
        <article className="feature-card">
          <h2>Discover Recipes</h2>
          <p>Find new recipes and save your favourites.</p>
          <div className="button-container">
          <Link to="/recipes" className="primary-button">Discover recipes</Link>
          </div>
        </article>

        <article className="feature-card">
          <h2>Family Recipes</h2>
          <p>Keep your own and traditional family recipes in one place.</p>
          <div className="button-container">
          <Link to="/recipes" className="primary-button">View recipes</Link>
          </div>
        </article>

        <article className="feature-card">
          <h2>Weekly Planner</h2>
          <p>Plan your meals for the upcoming week.</p>
          <div className="button-container">
          <Link to="/planner" className="primary-button">Plan your week</Link>
          </div>
        </article>

        <article className="feature-card">
          <h2>Shopping List</h2>
          <p>Create a shopping list automatically from your meal plan.</p>
          <div className="button-container">
          <Link to="/shopping" className="primary-button">View shopping list</Link>
          </div>
        </article>
      </div>

      <section className="recipe-inspiration">
        <h2>Recipe Inspiration</h2>

        {loading && <p>Loading recipe...</p>}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}

        {recipe && (
          <article className="recipe-inspiration-card">
            <img
              src={recipe.image}
              alt={recipe.title}
              className="recipe-inspiration-image"
            />

            <div>
              <h3>{recipe.title}</h3>

              <p>{recipe.category}</p>

              {recipe.cuisine && (
                <p>{recipe.cuisine}</p>
              )}
            </div>
          </article>
        )}
      </section>
    </section>

    
  );
}

export default Home;