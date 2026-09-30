import api from "../services/api";
import FamilyRecipeForm from "../components/FamilyRecipeForm";

function AddFamilyRecipes() {
  async function handleSave(recipeData) {
    await api.post("/recipes/custom", recipeData);
  }

  return (
    <main className="family-recipe-page">
      <h1>Save your Family Recipe</h1>

      <FamilyRecipeForm
        onSubmit={handleSave}
        submitText="Save recipe"
      />
    </main>
  );
}
export default AddFamilyRecipes;