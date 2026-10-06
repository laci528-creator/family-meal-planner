function PlannerRecipeCard({ recipe, onSelect, isSaving }) {
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
          disabled={isSaving}
        >
          {isSaving ? "Saving..." : "Select"}
        </button>
      </div>
    </div>
  );
}

export default PlannerRecipeCard;