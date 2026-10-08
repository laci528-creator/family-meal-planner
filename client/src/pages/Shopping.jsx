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
  const [listGenerate, setListGenerate] = useState(false);
  const [message, setMessage] = useState("");
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

  useEffect(() => {
    fetchShoppingList();
  }, [currentMonday]);


      async function handleGenerateShoppingList() {
      setListGenerate(true);
      setError(null);
      setMessage("");

      try {
        const startDate =
          formatDateForApi(currentMonday);

        const response = await api.post("/shopping/generate", null, {
          params: {
            startDate,
          },
        });

        await fetchShoppingList();

        setMessage(
          response.data.message
        )


      } catch (error) {
        setError("Could not generate shopping list.");
        console.error(
          "Could not generate shopping list:",
          error
        );
      } finally {
        setListGenerate(false);
      }
    }

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
      <div className="shopping-week-actions">
        <button onClick={() => changeWeek(-1)}>&lt; Previous week</button>
        <button onClick={() => setCurrentMonday(getWeekStart(new Date()))}>Current week</button>
 
        <button onClick={() => changeWeek(1)}>Next week &gt;</button>
      </div>
        <button
          className="primary-button"
          onClick={handleGenerateShoppingList}
          disabled={listGenerate}
        >
            {listGenerate
                ? "Generating..."
                :shoppingList.length === 0
              ? "Generate shopping list"
              : "Refresh from planner"}
        </button>
      </div>
    {message && (
      <p className="shopping-message">
        {message}
      </p>
    )}

    {ingredientsLoading ? (
    <p>Loading shopping list...</p>
  ) :  error ? (
    <p className="error-message">{error}</p>
  ) : shoppingList.length === 0 ? (
        <p>No shopping items for this week.</p>
      ) : (
      <div className="shopping-list">
        {shoppingList.map((item) => {
            const itemKey = item.id;
            const status =
              itemStatus[itemKey] ??
              item.status ??
              "needed";
          
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