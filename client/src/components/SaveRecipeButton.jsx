import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

function SaveRecipeButton({ externalId }) {
  const [isSaving, setIsSaving] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [message, setMessage] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!user) {
      setIsChecking(false);
      return;
    }

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
}, [externalId, user, loading]);

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
    
  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <div className="save-recipe-container">
        <Link
          to="/login"
          className="primary-button"
        >
          Login to save
        </Link>
      </div>
    );
  }

  return (
    <div className="save-recipe-container">
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

