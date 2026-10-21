import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import SaveRecipeButton from '../components/SaveRecipeButton';

function RecipeDetails() {
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cookingMode, setCookingMode] = useState(false);
  const [completedStep, setCompletedStep] = useState(-1); // must smaller 0 index(sentinel value)


  function splitInstructionsIntoSentences(text) {
    if (!text) return [];

    const segmenter = new Intl.Segmenter(
      "en",
      { granularity: "sentence" }
    );

    return Array.from(
      segmenter.segment(text),
      (segment) => segment.segment.trim()
    ).filter(Boolean);
  }


  function handleResetCookingProgress() {
    setCompletedStep(-1);
    setCookingMode(false);
  }


  const instructionSteps =
    splitInstructionsIntoSentences(
      recipe?.instructions
    );



  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);
        setRecipe(null);

        const response =
          await api.get(`/recipes/${id}`);

        const savedProgress =
          localStorage.getItem(
            `cooking-progress-${id}`
          );

        setCompletedStep(
          savedProgress !== null
            ? Number(savedProgress)
            : -1
        );

        setRecipe(response.data.recipe);

      } catch (err) {
        console.error(
          "Error loading recipe:",
          err
        );

        if (err.response?.status === 404) {
          setError("Recipe not found.");
        } else {
          setError(
            "The recipe could not be loaded."
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);


  useEffect(() => {
    if (!recipe) return;

    const progressKey =
      `cooking-progress-${id}`;

    if (completedStep < 0) {
      localStorage.removeItem(progressKey);
      return;
    }

    localStorage.setItem(
      progressKey,
      completedStep.toString()
    );
  }, [completedStep, id, recipe]);


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
    <div className="recipe-details-page">
      <div className="recipe-details-card">

        <div className="recipe-details-header">
          <img
            className="recipe-details-image"
            src={recipe.image}
            alt={recipe.title}
          />

          <div className="recipe-details-info">
            <h1>{recipe.title}</h1>

            <div className="recipe-details-meta">
              <p>
                <strong>Category:</strong>{" "}
                {recipe.category}
              </p>

              {recipe.cuisine && (
                <p>
                  <strong>Cuisine:</strong>{" "}
                  {recipe.cuisine}
                </p>
              )}
            </div>

            <SaveRecipeButton
              externalId={recipe.externalId}
            />
            <div className="cooking-mode-controls">
              {!cookingMode ? (
  <button
    type="button"
    className="primary-button cooking-mode-button"
    onClick={() => setCookingMode(true)}
  >
    {completedStep >= 0
      ? "Continue cooking"
      : "Start cooking"}
  </button>
) : (
  <div className="cooking-mode-panel">
    <h3>Cooking Mode</h3>

    <p className="cooking-mode-hint">
      Tap a sentence to update your cooking progress.
      <br />
      Your progress is saved automatically on this device.
    </p>

    <button
      type="button"
      className="primary-button reset-cooking"
      onClick={handleResetCookingProgress}
    >
      Reset cooking progress
    </button>
  </div>
)}
            </div>
          </div>
        </div>

        <section className="recipe-details-section">
          <h2>Instructions</h2>
          <p className="cooking-instructions">
            {instructionSteps.map((step, index) => (
              <span
                key={index}
                onClick={
                  cookingMode
                    ? () => setCompletedStep(index)
                    : undefined}
                className={
                  cookingMode
                    ? index <= completedStep
                      ? "cooking-text-completed"
                      : "cooking-text-active"
                    : "cooking-text"
                }
              >
                {step}{" "}
              </span>
            ))}
          </p>
        </section>

        {recipe.ingredients?.length > 0 && (
          <section className="recipe-details-section">
            <h2>Ingredients</h2>

            <ul className="ingredients-list">
              {recipe.ingredients.map(
                (ingredient, index) => (
                  <li
                    key={`${ingredient.name}-${index}`}
                  >
                    <span>{ingredient.name}</span>
                    <strong>
                      {ingredient.measure}
                    </strong>
                  </li>
                )
              )}
            </ul>
          </section>
        )}

      </div>
    </div>
  );
}

export default RecipeDetails;