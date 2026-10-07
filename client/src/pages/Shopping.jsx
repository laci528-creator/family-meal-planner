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
const [itemStatus, setItemStatus] = useState({});
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
      setItemStatus({});
      
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


  function handleStatusChange(itemKey, newStatus, checked) {
  setItemStatus((previousStatus) => ({
    ...previousStatus,
    [itemKey]: checked ? newStatus : "needed",
  }));
}

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
        {shoppingList.map((item, index) => {
            const itemKey = `${item.ingredientId}-${index}`;
            const status = itemStatus[itemKey] || "needed";
          
          return (
          <div
            key={itemKey}
            className="shopping-item"
          >
            <button
              className="shopping-delete-button"
                type="button"
            >
              Delete
            </button>
            <div className="shopping-item-info">
              <strong className="ingredient-name">{item.name}</strong> <span className="ingredient-measure">{item.measure}</span>
            </div>
            <div className="shopping-item-actions">

              <label className="shopping-checkbox">
                <input
                  type="checkbox"
                  checked={status === "at_home"}
                  onChange={(e) =>
                    handleStatusChange(
                      itemKey,
                      "at_home",
                      e.target.checked
                    )
                  }
                />
                <span>At home</span>
              </label>
                        <label className="shopping-checkbox">
                  <input
                    type="checkbox"
                    checked={status === "purchased"}
                    onChange={(e) =>
                      handleStatusChange(
                        itemKey,
                        "purchased",
                        e.target.checked
                      )
                    }
                  />
                  <span>Purchased</span>
                </label>
            </div>
          </div>
        );
      })}
      </div>
      )}
    </main>
  );
}

export default Shopping;