export function getWeekStart(date = new Date()) {
  const currentDate = new Date(date);

  const dayOfWeek = currentDate.getDay();

  const diff =
    currentDate.getDate() -
    (dayOfWeek === 0 ? 6 : dayOfWeek - 1);

  const currentMonday = new Date(currentDate);

  currentMonday.setDate(diff);
  currentMonday.setHours(0, 0, 0, 0);

  return currentMonday;
}

export function getWeekDays(date = new Date()) {
  const weekStart = getWeekStart(date);
  const weekDays = [];

  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    weekDays.push(day);
  }

  return weekDays;
}

export function formatDate(date) {
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "2-digit",
    month: "2-digit",
  });
}

export function formatDateForApi(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}


export function addWeeks(date, weeks) {
  const newDate = new Date(date);

  newDate.setDate(
    newDate.getDate() + weeks * 7
  );

  return newDate;
}
