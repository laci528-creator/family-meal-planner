import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function RecipeDetails() {
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

          const response = await api.get(`/recipes/${id}`);
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

      <p>Recipe ID: {recipe.externalId}</p>

      <p>{recipe.category}</p>

      {recipe.cuisine && <p>{recipe.cuisine}</p>}

      <img src={recipe.image} alt={recipe.title} />

      <h2>Instructions</h2>
      <p>{recipe.instructions}</p>
      {recipe.ingredients?.length > 0 && (
        <>
        <h2>Ingredients</h2>

        <ul className="ingredients-list">
        {recipe.ingredients.map((ingredient, index) => (
            <li key={`${ingredient.name}-${index}`}>
            {ingredient.name}: {ingredient.measure}
            </li>
        ))}
        </ul>
          </>
        )}
    </div>
  );
}

export default RecipeDetails;