import { useState } from 'react';

function FamilyRecipeForm({
  initialData,
  onSubmit,
  submitText = "Save recipe",
}) {

    const [formData, setFormData] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "",
    cuisine: initialData?.cuisine || "",
    instructions: initialData?.instructions || "",
    imageUrl: initialData?.image || "",
    });

    const [ingredients, setIngredients] = useState(
          initialData?.ingredients?.length
            ? initialData.ingredients
            : [{ name: "", measure: "" }]
    );

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((currentData) => ({
            ...currentData,
            [name]: value,
        }));
    }

    function handleIngredientChange(index, field, value) {
  setIngredients((currentIngredients) =>
    currentIngredients.map((ingredient, ingredientIndex) =>
      ingredientIndex === index
        ? {
            ...ingredient,
            [field]: value,
          }
        : ingredient
    )
  );
}

async function handleSubmit(event) {
  event.preventDefault();

  setError("");

  const validIngredients = ingredients.filter(
    (ingredient) => ingredient.name.trim() !== ""
  );

  if (validIngredients.length === 0) {
    setError("At least one ingredient is required.");
    return;
  }

  setIsSubmitting(true);

  try {
    await onSubmit({
      ...formData,
      ingredients: validIngredients,
    });
  } catch (error) {
    console.error("Recipe form error:", error);

    setError(
      error.response?.data?.message ||
      "Could not save recipe."
    );
  } finally {
    setIsSubmitting(false);
  }
}


  function addIngredient() {
  if (ingredients.length >= 20) {
    return;
  }

  setIngredients((currentIngredients) => [
    ...currentIngredients,
    {
      name: "",
      measure: "",
    },
  ]);
}

function removeIngredient(indexToRemove) {
    setIngredients((currentIngredients) =>
    currentIngredients.filter((_, index) => index !== indexToRemove)
  );

}

return (
    <>
    {error && (
        <p className="error-message">
            {error}
        </p>
    )}
    
      <form onSubmit={handleSubmit} className="family-recipe-form">
        <div className="recipe-fields">

          <div className="form-group">
        <label htmlFor="title" className="form-label">Recipe Title:</label>
            <input
                className="form-input"
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                />
            <label htmlFor="category" className="form-label">Category:</label>
            <input
                className="form-input"
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                />
                </div>
              <div className="form-group">
            <label htmlFor="cuisine" className="form-label">Cuisine:</label>
            <input
                className="form-input"
                type="text"
                id="cuisine"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                />
            <label htmlFor="imageUrl" className="form-label">Image URL:</label>
            <input
                className="form-input"
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://..."
                />
              </div>
              <div className="form-group instructions-field">
            <label htmlFor="instructions" className="form-label">Instructions:</label>
            <textarea
                className="form-textarea"
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows="8"
                required
                />
              </div>

        </div>
        <h3>Ingredients</h3>

        <div className="ingredients-field-container">
            {ingredients.map((ingredient, index) => (
                <div
                className="ingredient-field"
                key={index}
                >
                <input
                    className="form-input"
                    type="text"
                    placeholder="Ingredient"
                    value={ingredient.name}
                    onChange={(event) =>
                    handleIngredientChange(
                        index,
                        "name",
                        event.target.value
                    )
                    }
                    required={index === 0}
                />
                <input
                    className="form-input"
                    type="text"
                    placeholder="Measure"
                    value={ingredient.measure}
                    onChange={(event) =>
                    handleIngredientChange(
                        index,
                        "measure",
                        event.target.value
                        )
                    }
                />
                
                {ingredients.length > 1 && (
                  
                    <button
                    type="button"
                    className="ingredient-remove-button"
                    onClick={() => removeIngredient(index)}
                    >
                    X
                    </button>
                )}
                </div>
            ))}
            <div className="family-recipe-actions">
            <button
                type="button"
                className="secondary-button"
                onClick={addIngredient}
                disabled={ingredients.length >= 20}
                >
                + Add ingredient
            </button>

            <button type="submit" className="primary-button" disabled={isSubmitting}>{isSubmitting ? "Saving..." : submitText}</button>
        </div>
        </div>
        </form>
        </>
    );

}

export default FamilyRecipeForm;