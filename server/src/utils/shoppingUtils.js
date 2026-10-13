import {
  parseMeasure,
  getMeasureType,
  convertWeightToGrams,
  convertVolumeToMl,
} from "./measureUtils.js";


function getShoppingItemGroup(item) {
  const parsedItem = parseMeasure(item.measure);

  if (parsedItem === null) {
    return {
      item,
      unitType: "unknown",
      convertedAmount: null,
    };
  }

  const unitType =
    getMeasureType(parsedItem.unit);

  let convertedAmount = null;

  if (unitType === "weight") {
    convertedAmount =
      convertWeightToGrams(item.measure);

  } else if (unitType === "volume") {
    convertedAmount =
      convertVolumeToMl(item.measure);
  }

  return {
    item,
    unitType,
    convertedAmount,
  };
}

export function groupShoppingItems(items) {
  const groupedItems = new Map();

  for (const item of items) {
    const processed = getShoppingItemGroup(item);

    const normalizedName = processed.item.name
      .trim()
      .toLowerCase();

    const unitType = processed.unitType;

    let key;

    if (unitType === "unknown") {
      key =
        `${normalizedName}-unknown`;
    } else {
      key = `${normalizedName}-${unitType}`;
    }

if (groupedItems.has(key)) {
  const existingItem = groupedItems.get(key);

  if (unitType === "unknown") {
    existingItem.measures.push(
      processed.item.measure
    );
  } else {
    existingItem.amount +=
      processed.convertedAmount;
  }

  existingItem.itemIds.push(
    processed.item.id
  );
}

 else {
      groupedItems.set(key, {
        name: processed.item.name,
        type: unitType,
        amount: processed.convertedAmount,
        measures:     
            unitType === "unknown"
                ? [processed.item.measure]
                : [],
        itemIds: [processed.item.id],
      });
    }
  }

  return [...groupedItems.values()];
}