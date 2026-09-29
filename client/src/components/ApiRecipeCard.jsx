import { Link } from "react-router-dom";

function ApiRecipeCard({ recipe }) {
  return (
    <article className="recipe-card">
      <img
        src={recipe.image}
        alt={recipe.title}
        className="recipe-card-image"
      />

      <div className="recipe-card-content">
        <h2>{recipe.title}</h2>

        {recipe.category && <p>{recipe.category}</p>}
        {recipe.cuisine && <p>{recipe.cuisine}</p>}

        <Link
          to={`/recipes/${recipe.externalId}`}
          className="primary-button"
        >
          View recipe
        </Link>
      </div>
    </article>
  );
}

export default ApiRecipeCard;