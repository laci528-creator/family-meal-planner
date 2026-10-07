
export function isValidISODate(dateString) {
    if (!dateString || typeof dateString !== 'string') return false;
    
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
        return false;
    }

    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);

    return (
        date.getFullYear() === year &&
        date.getMonth() === month - 1 &&
        date.getDate() === day
    );
}

export function getEndDate(startDate) {
  const [year, month, day] = startDate
    .split("-")
    .map(Number);

  const date = new Date(year, month - 1, day);

  date.setDate(date.getDate() + 6);

  const endYear = date.getFullYear();
  const endMonth = String(date.getMonth() + 1).padStart(2, "0");
  const endDay = String(date.getDate()).padStart(2, "0");

  return `${endYear}-${endMonth}-${endDay}`;
}