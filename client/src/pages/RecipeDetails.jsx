import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import SaveRecipeButton from '../components/SaveRecipeButton';
import CookingMode from "../components/CookingMode";

function RecipeDetails({ source = "external" }) {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);
        setRecipe(null);

        const endpoint =
          source === "saved"
            ? `/recipes/saved-recipe/${id}`
            : `/recipes/${id}`;

        const response = await api.get(endpoint);

        setRecipe(response.data.recipe);

      } catch (err) {
        console.error(
          "Error loading recipe:",
          err
        );

        if (err.response?.status === 404) {
          setError("Recipe not found.");
        } else {
          setError(
            "The recipe could not be loaded."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, source]);


  if (loading) {
    return <p>Loading recipe...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!recipe) {
    return null;
  }

  const recipeImage = recipe.image;


  return (
    <div className="recipe-details-page">
      <div className="recipe-details-card">

        <div className="recipe-details-header">
          <img
            className="recipe-details-image"
            src={recipeImage || "/images/recipe-placeholder.jpg"}
            alt={recipeImage ? recipe.title : "No recipe image available"}
            onError={(event) => {
              event.currentTarget.src =
                "/images/recipe-placeholder.jpg";
            }}
          />

          <div className="recipe-details-info">
            <h1>{recipe.title}</h1>

            <div className="recipe-details-meta">
              <p>
                <strong>Category:</strong>{" "}
                {recipe.category}
              </p>

              {recipe.cuisine && (
                <p>
                  <strong>Cuisine:</strong>{" "}
                  {recipe.cuisine}
                </p>
              )}
            </div>

            {source !== "saved" && (
              <SaveRecipeButton
                externalId={recipe.externalId}
              />
            )}

            {source === "saved" &&
              recipe.source === "custom" && (
                <Link
                  to={`/recipes/saved/${recipe.id}/edit`}
                  className="primary-button edit-recipe-button"
                >
                  Edit recipe
                </Link>
              )}

          </div>
        </div>

        <section className="recipe-details-section">
          <h2>Instructions</h2>
          <CookingMode
            recipeId={`${source}-${id}`}
            instructions={recipe.instructions}
          />

        </section>

        {recipe.ingredients?.length > 0 && (
          <section className="recipe-details-section">
            <h2>Ingredients</h2>

            <ul className="ingredients-list">
              {recipe.ingredients.map(
                (ingredient, index) => (
                  <li
                    key={`${ingredient.name}-${index}`}
                  >
                    <span>{ingredient.name}</span>
                    <strong>
                      {ingredient.measure}
                    </strong>
                  </li>
                )
              )}
            </ul>
          </section>
        )}

      </div>
    </div>
  );
}

export default RecipeDetails;