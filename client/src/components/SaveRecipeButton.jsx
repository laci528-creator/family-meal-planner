import { useState, useEffect } from "react";
import api from "../services/api";

function SaveRecipeButton({ externalId }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [message, setMessage] = useState("");
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
  async function checkSaved() {
    try {
      setIsChecking(true);
      const response = await api.get(
        `/recipes/saved/${externalId}`
      );

      setIsSaved(response.data.saved);
    } catch (error) {
      console.error("Could not check recipe status:", error);
    } finally {
      setIsChecking(false);
    }
  }

  checkSaved();
}, [externalId]);

  async function handleSave() {
    try {
      setIsSaving(true);
      setMessage("");

      await api.post("/recipes/api", {
        externalId,
      });

      setIsSaved(true);
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
        disabled={isChecking || isSaving || isSaved}
      >
        {isChecking
          ? "Checking..." :
          isSaved ? "Saved" : 
          isSaving ? "Saving..." : "Save recipe"}
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default SaveRecipeButton;