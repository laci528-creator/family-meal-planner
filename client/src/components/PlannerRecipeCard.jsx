function PlannerRecipeCard({ recipe, onSelect }) {
  return (
    <div className="planner-recipe-card">
      {recipe.image_url && (
        <img
          src={recipe.image_url}
          alt={recipe.title}
        />
      )}

      <div>
        <h3>{recipe.title}</h3>

        {recipe.category && (
          <p>{recipe.category}</p>
        )}

        <button
          onClick={() => onSelect(recipe)}
        >
          Select
        </button>
      </div>
    </div>
  );
}

export default PlannerRecipeCard;