import { useEffect, useState } from "react";
import api from "../services/api";

import {
  getWeekStart,
  formatDateForApi,
} from "../utils/dateUtils";

function Shopping() {
  const [shoppingList, setShoppingList] = useState([]);
  const [currentMonday] = useState(() =>
    getWeekStart(new Date())
  );

  useEffect(() => {
    async function fetchShoppingList() {
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
        console.error(
          "Could not load shopping list:",
          error
        );
      }
    }

    fetchShoppingList();
  }, [currentMonday]);

  return (
    <main className="shopping-page">
      <h1>Weekly Shopping List</h1>

      <div className="shopping-list">
        {shoppingList.map((item, index) => (
          <div
            key={`${item.ingredientId}-${index}`}
            className="shopping-item"
          >
            <div>
              <strong>{item.name}</strong>
            </div>

            <span>{item.measure}</span>
          </div>
        ))}
      </div>
    </main>
  );
}

export default Shopping;