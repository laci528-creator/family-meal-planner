import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

function SavedRecipeDetails() {
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

          const response = await api.get(`/recipes/saved-recipe/${id}`);
          setRecipe(response.data.recipe);
        } catch (err) {
          console.error('Error loading recipe:', err);

          if (err.response?.status === 404) {
            setError('Recipe not found.');
          } else {
            setError('The recipe could not be loaded.');
          }
        }
        finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) {
    return <p>Loading recipe...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!recipe) {
    return null;
  }

  return (
    <div className="recipe-details-page">
      <h1>{recipe.title}</h1>
        <div className="recipe-details-actions">
          {recipe.source === "custom" && (
            <Link
              to={`/recipes/saved/${recipe.id}/edit`}
              className="primary-button"
            >
              Edit recipe
            </Link>
          )}
        </div>

      <p>Recipe ID: {recipe.id}</p>

      <p>{recipe.category}</p>

      {recipe.cuisine && <p>{recipe.cuisine}</p>}

      <img src={recipe.image_url} alt={recipe.title} />

      <h2>Instructions</h2>
      <p>{recipe.instructions}</p>
      {recipe.ingredients?.length > 0 && (
        <>
        <h2>Ingredients</h2>

        <ul className="ingredients-list">
        {recipe.ingredients.map((ingredient, index) => (
            <li key={`${ingredient.id}-${index}`}>
            {ingredient.name}: {ingredient.measure}
            </li>
        ))}
        </ul>
          </>
        )}
    </div>
  );
}

export default SavedRecipeDetails;