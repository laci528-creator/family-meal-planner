import { useState } from "react";

function ShoppingItemForm({ onAddItem, isSaving }) {
  const [name, setName] = useState("");
  const [measure, setMeasure] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      return;
    }

    onAddItem({
      name: name.trim(),
      measure: measure.trim(),
    });

    setName("");
    setMeasure("");
  }

  return (
    <form
      className="shopping-item-form"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        placeholder="Item name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        type="text"
        placeholder="Amount / measure"
        value={measure}
        onChange={(e) => setMeasure(e.target.value)}
      />

      <button
        type="submit"
        className="primary-button"
        disabled={isSaving}
      >
        {isSaving ? "Adding..." : "Add item"}
      </button>
    </form>
  );
}

export default ShoppingItemForm;