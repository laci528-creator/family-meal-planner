import { useEffect, useState } from "react";
import api from "../services/api";

import {
  getWeekStart,
  formatDateForApi,
  addWeeks,
  addDays,
} from "../utils/dateUtils";

function Shopping() {
  const [shoppingList, setShoppingList] = useState([]);
  const [ingredientsLoading, setIngredientsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMonday, setCurrentMonday] = useState(() =>
    getWeekStart(new Date())
  );

    const changeWeek = (weeks) => {
      setCurrentMonday(
        addWeeks(currentMonday, weeks)
      );
    };
  


  useEffect(() => {
    async function fetchShoppingList() {

      setIngredientsLoading(true);
      setError(null);
      
      try {
        const startDate =
          formatDateForApi(currentMonday);

        const response = await api.get("/shopping", {
          params: {
            startDate,
          },
        });

        setShoppingList(
          response.data.shoppingList
        );

      } catch (error) {
        setError("Could not load shopping list.");
        console.error(
          "Could not load shopping list:",
          error
        );
      } finally {
        setIngredientsLoading(false);
      }
    }

    fetchShoppingList();
  }, [currentMonday]);

  return (
    <main className="shopping-page">
      <h1>Weekly Shopping List</h1>
      <div className="calendar-header">
        <h3>
          {currentMonday.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })} - 
          {addDays(currentMonday, 6).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric'  })}
        </h3>
        <button onClick={() => changeWeek(-1)}>&lt; Previous week</button>
        <button onClick={() => setCurrentMonday(getWeekStart(new Date()))}>Current week</button>
 
        <button onClick={() => changeWeek(1)}>Next week &gt;</button>
      </div>

    {ingredientsLoading ? (
    <p>Loading shopping list...</p>
  ) :  error ? (
    <p className="error-message">{error}</p>
  ) : shoppingList.length === 0 ? (
        <p>No shopping items for this week.</p>
      ) : (
      <div className="shopping-list">
        {shoppingList.map((item, index) => (
          <div
            key={`${item.ingredientId}-${index}`}
            className="shopping-item"
          >
            <div className="shopping-item-info">
              <strong className="ingredient-name">{item.name}</strong> <span className="ingredient-measure">{item.measure}</span>
            </div>
            <div className="shopping-item-actions">
              
                <label className="shopping-checkbox">
                  <input
                    type="checkbox"
                  />
                  <span>At home</span>
                </label>
                <label className="shopping-checkbox">
                  <input
                    type="checkbox"
                  />
                  <span>Purchased</span>
                </label>
                <button
                  className="shopping-delete-button"
                  type="button"
                >
                  Delete
                </button>
            </div>

          </div>
        ))}
      </div>
      )}
    </main>
  );
}

export default Shopping;