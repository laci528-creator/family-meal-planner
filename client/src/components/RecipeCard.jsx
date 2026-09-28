import { Link } from "react-router-dom";
import DeleteRecipeButton from "./DeleteRecipeButton";

function RecipeCard({ recipe, onDeleted }) {
  return (
    <article className="recipe-card">
      <img
        src={recipe.image_url}
        alt={recipe.title}
        className="recipe-card-image"
      />

      <div className="recipe-card-content">
        <h2>{recipe.title}</h2>

        {recipe.category && (
          <p>{recipe.category}</p>
        )}

        {recipe.cuisine && (
          <p>{recipe.cuisine}</p>
        )}
        <div className="recipe-card-actions">
            <Link
            to={`/recipes/saved/${recipe.id}`}
            className="primary-button"
            >
            View recipe
            </Link>
            <DeleteRecipeButton
                recipeId={recipe.id}
                onDeleted={onDeleted}
                />
        </div>
      </div>
    </article>
  );
}

export default RecipeCard;