import { useState, useEffect } from "react";
import api from "../services/api";
import PlannerRecipeCard from "../components/PlannerRecipeCard";

import {
  getWeekDays,
  formatDateForApi,
  getWeekStart,
} from "../utils/dateUtils";

const dayNames = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function Planner() {

  const [plannerData, setPlannerData] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [currentMonday, setCurrentMonday] = useState(() =>
    getWeekStart(new Date())
  );

  const changeWeek = (weeks) => {
    const newMonday = new Date(currentMonday);
    newMonday.setDate(
      currentMonday.getDate() + weeks * 7
    );

    setCurrentMonday(newMonday);
  };

  const weekDays = getWeekDays(currentMonday);

  async function fetchPlannerData() {
    try {
      setLoading(true);
      setError(null);

      const startDate = formatDateForApi(currentMonday);

      const response = await api.get("/planner", {
        params: { startDate },
      });

      setPlannerData(response.data.weeklyPlannerData);

    } catch (error) {
      console.error("Planner loading error:", error);
      setError("Could not load planner data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPlannerData();
  }, [currentMonday]);


  useEffect(() => {
    async function fetchRecipes() {
      try {
        const response = await api.get("/recipes");
        setRecipes(response.data.recipes);
      } catch (err) {
        console.error("Could not load recipes:", err);
        setError("Could not load saved recipes.");
      } finally {
        setLoading(false);
      }
    }

    fetchRecipes();
  }, []);

function getPlannedMeal(date, mealType) {
  const isoDate = formatDateForApi(date);

  return plannerData.find(
    (entry) =>
      entry.plan_date === isoDate &&
      entry.meal_type === mealType
  );
}


  async function handleSelectRecipe(recipe) {
    try {
      setIsSaving(true);
      setMessage("");

      await api.post("/planner/save", {
        planDate: selectedSlot.date,
        mealType: selectedSlot.mealType,
        recipeId: recipe.id,
      });

    await fetchPlannerData();

    setMessage("Meal successfully added to planner.");
    setSelectedSlot(null);
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
        "Could not save recipe planner."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="planner-calendar">

      <div className="calendar-header">
        <h3>
          {currentMonday.toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })}
        </h3>
        <button onClick={() => changeWeek(-1)}>&lt; Previous week</button>
        <button onClick={() => setCurrentMonday(getWeekStart(new Date()))}>Current week</button>
 
        <button onClick={() => changeWeek(1)}>Next week &gt;</button>
      </div>

      <div className="calendar-grid">
        {weekDays.map((date, index) => {
          const isoDate = formatDateForApi(date);

          const isToday =
            formatDateForApi(new Date()) === isoDate;

          return (
            <div
              key={isoDate}
              className={`day-card ${isToday ? "today" : ""}`}
            >
              <div className="day-header">
                <span className="day-name">
                  {dayNames[index]}
                </span>

                <span className="day-number">
                  {date.getDate()}
                </span>
              </div>

              <div className="day-content">
                {["breakfast", "lunch", "dinner"].map(
                  (mealType) => {
                    const plannedMeal = getPlannedMeal(date, mealType);

                    return (
                      <div
                        key={mealType}
                        className="meal-slot"
                      >
                        <h4>{mealType}</h4>
                        {plannedMeal ? (
                          <p>{plannedMeal.title}</p>
                        ) : (
                          <>
                          <p>No meal planned</p>
                            <button
                                onClick={() =>
                                  setSelectedSlot({
                                    date: isoDate,
                                    mealType,
                                  })
                                }
                              >
                                Add meal
                            </button>
                          </>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          );
        })}
      </div>
      {loading && <p>Loading planner data...</p>}
      {error && <p className="error">{error}</p>}
      {message && (
        <p className="planner-message">
          {message}
        </p>
      )}

      {selectedSlot && (
        <div className="recipe-selector">
              <h2>Select a recipe</h2>

              <p>
                {selectedSlot.date} - {selectedSlot.mealType}
              </p>
          {recipes.map((recipe) => (
            <PlannerRecipeCard
              key={recipe.id}
              recipe={recipe}
              onSelect={handleSelectRecipe}
              isSaving={isSaving}
            />
          ))}
          <button onClick={() => setSelectedSlot(null)}
            disabled={isSaving}
            >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default Planner;