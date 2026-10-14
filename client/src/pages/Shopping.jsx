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
  const [deletingItemKey, setDeletingItemKey] = useState(null);
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

  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      setMessage("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [message]);


  async function handleGenerateShoppingList() {

    setError(null);
    setMessage("");

    try {
      const startDate =
        formatDateForApi(currentMonday);

      const plannerResponse = await api.get(
        "/planner",
        {
          params: {
            startDate,
          },
        }
      );

      const plannedMeals =
        plannerResponse.data.weeklyPlannerData.length;

      const totalSlots = 21;

      if (plannedMeals < totalSlots) {
        const confirmed = window.confirm(
          `Only ${plannedMeals} of ${totalSlots} meal slots are planned. Generate shopping list anyway?`
        );

        if (!confirmed) {
          return;
        }
      }

      setListGenerate(true);

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
    itemIds,
    itemKey,
    newStatus,
    checked
  ) {
    const status = checked
      ? newStatus
      : "needed";

    try {
      await api.patch(
        `/shopping/status`,
        {
          itemIds,
          status,
        }
      );

      setItemStatus((previousStatus) => ({
        ...previousStatus,
        [itemKey]: status,
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


  async function deleteItem(itemIds, itemKey) {

    setDeletingItemKey(itemKey);
    setError(null);
    setMessage("");

    try {

      const response = await api.delete(
        `/shopping`,
        {
          data: {
            itemIds,
          },
        }
      );

      await fetchShoppingList();

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
      setDeletingItemKey(null);
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

      await fetchShoppingList();

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

      <div className="week-navigation">
        <h2 className="week-date">
          {currentMonday.toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })} -
          {addDays(currentMonday, 6).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })}
        </h2>
        <div className="week-navigation-buttons">
          <button onClick={() => changeWeek(-1)}>&lt; Previous week</button>
          <button onClick={() => setCurrentMonday(getWeekStart(new Date()))}>Current week</button>

          <button onClick={() => changeWeek(1)}>Next week &gt;</button>
        </div>

      </div>
      <div className="shopping-actions-panel">
        <button
          className="primary-button refresh-shopping-button"
          onClick={handleGenerateShoppingList}
          disabled={listGenerate}
        >
          {listGenerate
            ? "Generating..."
            : shoppingList.length === 0
              ? "Generate shopping list"
              : "Refresh from planner"}
        </button>

        <ShoppingItemForm
          onAddItem={handleAddItem}
          isSaving={itemSaving}
        />
      </div>
      {message && (
        <p className="shopping-message"
          role="status"
          aria-live="polite">
          {message}
        </p>
      )}

      {ingredientsLoading ? (
        <p>Loading shopping list...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : shoppingList.length === 0 ? (
        <p>No shopping items for this week.</p>
      ) : (
        <div className="shopping-list">
          {shoppingList.map((item) => {
            const itemKey = item.itemIds.join("-");
            const status =
              itemStatus[itemKey] ??
              item.status ??
              "needed";

            return (
              <div
                key={itemKey}
                className="shopping-item"
              >
                <div className="shopping-item-main">
                  <button
                    className="shopping-delete-button"
                    aria-label={`Delete ${item.name}`}
                    type="button"
                    onClick={() => deleteItem(item.itemIds, itemKey)}
                    disabled={deletingItemKey === itemKey}
                  >
                    {deletingItemKey === itemKey
                      ? "Deleting..."
                      : "X"}
                  </button>

                  <strong>{item.name}</strong>
                </div>
                <div className="shopping-item-measure">
                  <p>{item.measure}</p>
                </div>
                <div className="shopping-item-actions">
                  <label className="shopping-checkbox">
                    <input
                      type="checkbox"
                      checked={status === "at_home"}
                      onChange={(e) =>
                        handleStatusChange(
                          item.itemIds,
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
                          item.itemIds,
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
