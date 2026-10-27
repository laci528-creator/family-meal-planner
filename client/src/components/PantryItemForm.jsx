import { useState } from "react";
import StatusMessage from "./StatusMessage";

function PantryItemForm({
  onAddItem,
  isSaving,
}) {
  const [ingredient, setIngredient] =
    useState("");

  const [error, setError] =
    useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");

    const validIngredient =
      ingredient.trim();

    if (!validIngredient) {
      setError("Ingredient name is required.");
      return;
    }

    const success = await onAddItem({
      name: validIngredient,
    });

    if (success) {
      setIngredient("");
    }
  }

  return (
    <>
      <StatusMessage type="error">
        {error}
      </StatusMessage>

      <form
        onSubmit={handleSubmit}
        className="pantry-items-form"
      >
        <label
          htmlFor="ingredient"
          className="form-label"
        >
          Ingredient:
        </label>

        <input
          id="ingredient"
          className="form-input"
          type="text"
          value={ingredient}
          onChange={(e) => {
            setIngredient(e.target.value);
            setError("");
          }}
          placeholder="e.g. Salt"
        />

        <button
          type="submit"
          className="primary-button"
          disabled={isSaving}
        >
          {isSaving
            ? "Saving..."
            : "Add item"}
        </button>
      </form>
    </>
  );
}

export default PantryItemForm;