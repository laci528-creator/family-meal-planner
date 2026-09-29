

function AddFamilyRecipes() {
    const [formData, setFormData] = useState({
    title: "",
    category: "",
    cuisine: "",
    instructions: "",
    imageUrl: "",
    });

    const [ingredients, setIngredients] = useState([
    {
        name: "",
        measure: "",
    },
    ]);

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

  async function handleSave(event) {
    event.preventDefault();
    
    setError("");

    setIsSubmitting(true);
    
    const validIngredients = ingredients.filter(
        (ingredient) => ingredient.name.trim() !== ""
    );

    try {
        await api.post("/recipes/custom", {
          ...formData,
            ingredients: validIngredients,
      });

    } catch (error) {
        console.error("Frontend error:", error);

        setError(
            error.response?.data?.message ||
            "Could not save family recipe."
        );
    }
    finally {
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
    <main className="family-recipe-page">
      <h1>Save your Family Recipes</h1>

      <form onSubmit={handleSave} className="family-recipe-form">
        <label htmlFor="title" className="form-label">Recipe Title:</label>
            <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                />
            <label htmlFor="category" className="form-label">Category:</label>
            <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                />
            <label htmlFor="cuisine" className="form-label">Cuisine:</label>
            <input
                type="text"
                id="cuisine"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                required
                />
            <label htmlFor="instructions" className="form-label">Instructions:</label>
            <textarea
                id="instructions"
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                rows="8"
                required
                />
            <label htmlFor="imageUrl" className="form-label">ImageUrl:</label>
            <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
                placeholder="https://..."
                />
        
        <h3>Ingredients</h3>

        <div className="ingredients-field-container">
            {ingredients.map((ingredient, index) => (
                <div
                className="ingredient-field"
                key={index}
                >
                <input
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
                />
                <input
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
                    onClick={() => removeIngredient(index)}
                    >
                    X
                    </button>
                )}
                </div>
            ))}
            </div>
            <button
                type="button"
                onClick={addIngredient}
                disabled={ingredients.length >= 20}
                >
                + Add ingredient
            </button>

        <button type="submit" className="primary-button" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save"}</button>

      </form>

  </main>
);


}

export default AddFamilyRecipes;