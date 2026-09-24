import { useState } from "react";
import api from "../services/api";

function SaveRecipeButton({ externalId }) {
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSave() {
    try {
      setIsSaving(true);
      setMessage("");

      await api.post("/recipes/api", {
        externalId,
      });

      setMessage("Recipe saved.");
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
        "Could not save recipe."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        className="primary-button"
        onClick={handleSave}
        disabled={isSaving}
      >
        {isSaving ? "Saving..." : "Save recipe"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default SaveRecipeButton;