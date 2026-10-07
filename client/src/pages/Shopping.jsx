import { useEffect, useState } from "react";
import api from "../services/api";

import {
  getWeekStart,
  formatDateForApi,
  addWeeks,
} from "../utils/dateUtils";

function Shopping() {
  const [shoppingList, setShoppingList] = useState([]);
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
      <div className="calendar-header">
        <h3>
          {currentMonday.toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })}
        </h3>
        <button onClick={() => changeWeek(-1)}>&lt; Previous week</button>
        <button onClick={() => setCurrentMonday(getWeekStart(new Date()))}>Current week</button>
 
        <button onClick={() => changeWeek(1)}>Next week &gt;</button>
      </div>

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