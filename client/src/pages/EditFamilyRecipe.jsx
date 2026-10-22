import { useEffect, useState } from "react";
import { useNavigate,useParams } from "react-router-dom";
import api from "../services/api";
import FamilyRecipeForm from "../components/FamilyRecipeForm";

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
    return <p>Loading recipe...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  if (!recipe) {
    return null;
  }


  return (
    <main className="family-recipe-page">
      <h1>
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