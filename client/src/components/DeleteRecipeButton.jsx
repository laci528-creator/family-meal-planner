import { useState } from "react";
import api from "../services/api";

function DeleteRecipeButton({ recipeId, onDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    try {
      setIsDeleting(true);
      setError("");

      await api.delete(`/recipes/${recipeId}`);

      onDeleted(recipeId);
    } catch (err) {
      console.error("Could not delete recipe:", err);
      setError("Could not delete recipe.");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        className="delete-button"
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default DeleteRecipeButton;