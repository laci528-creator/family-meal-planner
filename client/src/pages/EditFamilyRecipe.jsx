import { useEffect, useState } from "react";
import { useNavigate,useParams, Navigate } from "react-router-dom";
import api from "../services/api";
import FamilyRecipeForm from "../components/FamilyRecipeForm";
import StatusMessage from "../components/StatusMessage";

function EditFamilyRecipes() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

      useEffect(() => {
    const fetchRecipe = async () => {
      try {
          setLoading(true);
          setError(null);
          setRecipe(null);

            const response = await api.get(
                `/recipes/saved-recipe/${id}`
            );
          setRecipe(response.data.recipe);
        } catch (err) {
          console.error('Error loading recipe:', err);

          if (err.response?.status === 404) {
            setError('Recipe not found.');
          } else {
            setError('The recipe could not be loaded.');
          }
        }
        finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  async function handleUpdate(recipeData) {
    await api.put(`/recipes/${id}`, recipeData);

    navigate(`/recipes/saved/${id}`);
  }

    if (loading) {
    return (
    <main className="page-container family-recipe-page">
      <StatusMessage type="info">
        Loading recipe...
      </StatusMessage>
    </main>
    );
  }

  if (error) {
    return (
    <main className="page-container family-recipe-page">
      <StatusMessage type="error">
        {error}
      </StatusMessage>
    </main>
    );
  }

  if (!recipe) {
    return <Navigate to="/404" replace />;
  }

  return (
    <main className="page-container family-recipe-page">
      <h1 className="page-title">
        {recipe.source === "api"
          ? "Customize your saved Api Recipe"
          : "Edit your Family Recipe"}
      </h1>
      <FamilyRecipeForm
        initialData={recipe}
        onSubmit={handleUpdate}
        submitText={
          recipe.source === "api"
            ? "Save changes"
            : "Update recipe"
        }
      />
    </main>
  );
}

export default EditFamilyRecipes; 