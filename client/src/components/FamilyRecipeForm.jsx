import { useState } from "react";
import api from "../services/api";
import { splitMeasure } from "../utils/measureUtils";
import StatusMessage from "./StatusMessage";

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
    image: initialData?.image || "",
  });

  const [imageFile, setImageFile] = useState(null);

  const [ingredients, setIngredients] = useState(
    initialData?.ingredients?.length
      ? initialData.ingredients.map((ingredient) => {
          const { amount, unit } = splitMeasure(ingredient.measure);

          return {
            ...ingredient,
            amount,
            unit,
          };
        })
      : [
          {
            name: "",
            amount: "",
            unit: "",
          },
        ],
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
          : ingredient,
      ),
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const validIngredients = ingredients.filter(
      (ingredient) => ingredient.name.trim() !== "",
    );

    const formattedIngredients = validIngredients.map((ingredient) => ({
      name: ingredient.name.trim(),
      measure: `${ingredient.amount} ${ingredient.unit}`.trim(),
    }));

    if (validIngredients.length === 0) {
      setError("At least one ingredient is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      let image = formData.image;

      if (imageFile) {
        const uploadData = new FormData();

        uploadData.append("image", imageFile);

        const uploadResponse = await api.post(
          "/uploads/recipe-image",
          uploadData,
        );

        image = uploadResponse.data.image;
      }

      await onSubmit({
        ...formData,
        image,
        ingredients: formattedIngredients,
      });
    } catch (error) {
      console.error("Recipe form error:", error);

      setError(error.response?.data?.message || "Could not save recipe.");
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
        amount: "",
        unit: "",
      },
    ]);
  }

  function removeIngredient(indexToRemove) {
    setIngredients((currentIngredients) =>
      currentIngredients.filter((_, index) => index !== indexToRemove),
    );
  }

  return (
    <>
      <StatusMessage type="error">{error}</StatusMessage>

      <form onSubmit={handleSubmit} className="family-recipe-form">
        <div className="recipe-fields">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Recipe Title:
            </label>
            <input
              className="form-input"
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
            <label htmlFor="category" className="form-label">
              Category:
            </label>
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
            <label htmlFor="cuisine" className="form-label">
              Cuisine:
            </label>
            <input
              className="form-input"
              type="text"
              id="cuisine"
              name="cuisine"
              value={formData.cuisine}
              onChange={handleChange}
            />
            <label htmlFor="image" className="form-label">
              Recipe image:
            </label>

            <input
              className="form-input"
              type="file"
              id="image"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                const file = event.target.files[0];

                setError("");

                if (file) {
                  setImageFile(file);
                }
              }}
            />
          </div>
          <div className="form-group instructions-field">
            <label htmlFor="instructions" className="form-label">
              Instructions:
            </label>
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
            <div className="ingredient-field" key={index}>
              <input
                className="form-input"
                type="text"
                placeholder="Ingredient"
                value={ingredient.name}
                onChange={(event) =>
                  handleIngredientChange(index, "name", event.target.value)
                }
                required={index === 0}
              />
              <input
                className="form-input"
                type="text"
                placeholder="Amount"
                value={ingredient.amount}
                onChange={(event) =>
                  handleIngredientChange(index, "amount", event.target.value)
                }
              />
              <select
                className="form-input"
                value={ingredient.unit}
                onChange={(event) =>
                  handleIngredientChange(index, "unit", event.target.value)
                }
              >
                <option value="">No unit</option>
                <option value="mg">mg</option>
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="l">l</option>
                <option value="tsp">tsp</option>
                <option value="tbsp">tbsp</option>
                <option value="cup">cup</option>
                <option value="piece">piece</option>
                <option value="cloves">cloves</option>
                <option value="slices">slices</option>
              </select>

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

            <button
              type="submit"
              className="primary-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : submitText}
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default FamilyRecipeForm;
