export function capitalizeFirstLetter(text) {
  const trimmedText = text.trim();

  return (
    trimmedText.charAt(0).toUpperCase() +
    trimmedText.slice(1).toLowerCase()
  );
}