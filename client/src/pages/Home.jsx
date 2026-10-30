import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";
import AboutProject from "../components/AboutProject";
import StatusMessage from "../components/StatusMessage";

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
    <main className="page-container">
      <section className="home-page">
        <div className="home-hero">
          <h1 className="home-title">Plan meals. Shop smarter.</h1>

          <p className="home-description">
            Choose your recipes, plan your meals for the week and automatically create
            your shopping list.
          </p>
        </div>

<div className="home-features">
  <article className="feature-card">
    <span className="feature-step">Step 1</span>

    <h2>Choose your recipes</h2>

    <p>
      Discover new recipes or add your own family recipes and save them to your
      personal collection.
    </p>

    <div className="button-container feature-buttons">
      <Link to="/discover" className="primary-button">
        Discover recipes
      </Link>

      <Link to="/recipes/family/new" className="secondary-button">
        Add family recipe
      </Link>
    </div>
  </article>

  <article className="feature-card">
    <span className="feature-step">Step 2</span>

    <h2>Plan your week</h2>

    <p>
      Choose saved recipes for breakfast, lunch and dinner and create your
      weekly meal plan.
    </p>

    <div className="button-container">
      <Link to="/planner" className="primary-button">
        Plan your week
      </Link>
    </div>
  </article>

  <article className="feature-card">
    <span className="feature-step">Step 3</span>

    <h2>Generate your shopping list</h2>

    <p>
      Automatically create a shopping list from all the meals you planned for
      the selected week.
    </p>

    <div className="button-container">
      <Link to="/shopping" className="primary-button">
        View shopping list
      </Link>
    </div>
  </article>

  <article className="feature-card">
    <span className="feature-step">Step 4</span>

    <h2>Check your pantry</h2>

    <p>
      Add ingredients you already have at home so they are excluded from your
      generated shopping list.
    </p>

    <div className="button-container">
      <Link to="/pantry" className="primary-button">
        Manage pantry
      </Link>
    </div>
  </article>
</div>

        <section className="recipe-inspiration">
          <StatusMessage type="info">
            {loading ? "Loading recipe..." : null}
          </StatusMessage>

          <StatusMessage type="error">{error}</StatusMessage>

          {recipe && (
            <article className="recipe-inspiration-card">
              <img
                src={recipe.image}
                alt={recipe.title}
                className="recipe-inspiration-image"
              />

              <div className="recipe-inspiration-text">
                <h2>Daily Recipe Inspiration</h2>

                <h3>{recipe.title}</h3>

                <p>
                  <span className="recipe-inspiration-label">Category:</span>{" "}
                  {recipe.category}
                </p>

                {recipe.cuisine && (
                  <p>
                    <span className="recipe-inspiration-label">Cuisine:</span>{" "}
                    {recipe.cuisine}
                  </p>
                )}
                <br />
                <Link
                  to={`/recipes/${recipe.externalId}`}
                  className="primary-button"
                >
                  View recipe
                </Link>
              </div>
            </article>
          )}
        </section>
        <AboutProject />
      </section>
    </main>
  );
}

export default Home;
