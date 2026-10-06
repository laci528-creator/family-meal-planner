function PlannerRecipeCard({ recipe, onSelect, isSaving }) {
  return (
    <div className="planner-recipe-card">
      {recipe.image_url ? (
        <img className="planner-recipe-image"
          src={recipe.image_url}
          alt={recipe.title}
        />
      ) : (
        <div className="planner-recipe-image-placeholder">
          No image available
        </div>
      )}

      <div className="planner-recipe-info">
        <h3>{recipe.title}</h3>

        {recipe.category && (
          <p>{recipe.category}</p>
        )}

        <button className="primary-button"
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