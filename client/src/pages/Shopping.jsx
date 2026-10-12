import { useEffect, useState } from "react";
import ShoppingItemForm from "../components/ShoppingItemForm";
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
  const [deletingItemId, setDeletingItemId] = useState(null);
  const [itemSaving, setItemSaving] = useState(false);
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
      setMessage("");
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

        const response = await api.post("/shopping/generate", {
          startDate,
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

async function handleStatusChange(
  itemId,
  newStatus,
  checked
) {
  const status = checked
    ? newStatus
    : "needed";

  try {
    await api.patch(
      `/shopping/${itemId}`,
      {
        status,
      }
    );

    setItemStatus((previousStatus) => ({
      ...previousStatus,
      [itemId]: status,
    }));

  } catch (error) {
    setError(
      "Could not update shopping item status."
    );

    console.error(
      "Could not update shopping item status:",
      error
    );
  }
}


async function deleteItem(itemId) {

  setDeletingItemId(itemId);
  setError(null);
  setMessage("");

  try {

    const response = await api.delete(
      `/shopping/${itemId}`
    );

      setShoppingList(prevList => prevList.filter(item => item.id !== itemId))

      setMessage(
       `${response.data.message} (${response.data.name})`
      );

    } catch (error) {
    setError(
      "Could not delete shopping item."
    );

    console.error(
      "Could not delete shopping item.",
      error
    );
  } finally {
    setDeletingItemId(null);
    }
}


async function handleAddItem({ name, measure }) {

    const weekStart = formatDateForApi(currentMonday);

    setItemSaving(true);
    setError(null);
    setMessage("");

    try {

    const response = await api.post(
      `/shopping`, {
        weekStart,
        name,
        measure 
      }
    );

    setShoppingList((prevList) =>
      [...prevList, response.data.item].sort((a, b) =>
        a.name.localeCompare(b.name)
      )
    );

    setMessage(response.data.message);

  } catch (error) {
    setError(
      "Could not save new shopping item."
    );

    console.error(
      "Could not save new shopping item.",
      error
    );
  } finally {
    setItemSaving(false);
  }
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
      <div>
        <ShoppingItemForm
          onAddItem={handleAddItem}
          isSaving={itemSaving}
        />
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
                onClick={() => deleteItem(item.id)}
                disabled={deletingItemId === item.id}
            >
                {deletingItemId === item.id
                  ? "Deleting..."
                  : "Delete"}
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
