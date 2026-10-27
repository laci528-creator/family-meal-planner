import { useState } from "react";
import api from "../services/api";
import StatusMessage from "./StatusMessage";

function DeleteRecipeButton({ recipeId, onDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this recipe?"
    );

    if (!confirmed) {
      return;
    }
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

      <StatusMessage type="error">
        {error}
      </StatusMessage>
    </div>
  );
}

export default DeleteRecipeButton;