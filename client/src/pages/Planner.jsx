import { useState } from "react";

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
                  (mealType) => (
                    <div
                      key={mealType}
                      className="meal-slot"
                    >
                      <small>{mealType}</small>
                    </div>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Planner;