function PantryItem({
  item,
  onDelete,
  isDeleting,
}) {
  return (
    <div className="pantry-item">
      <span>{item.name}</span>

      <button
        type="button"
        className="pantry-delete-button"
        onClick={() => onDelete(item.id)}
        disabled={isDeleting}
        aria-label={`Delete ${item.name}`}
      >
        {isDeleting
          ? "Deleting..."
          : "X"}
      </button>
    </div>
  );
}

export default PantryItem;