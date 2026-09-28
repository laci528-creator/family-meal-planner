import { Link } from "react-router-dom";

function RecipeCard({ recipe }) {
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

        <Link
          to={`/recipes/${recipe.external_id}`}
          className="primary-button"
        >
          View recipe
        </Link>
      </div>
    </article>
  );
}

export default RecipeCard;