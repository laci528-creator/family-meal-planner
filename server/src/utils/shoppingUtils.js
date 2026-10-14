import {
  parseMeasure,
  getMeasureType,
  convertWeightToGrams,
  convertVolumeToMl,
  formatGroupedMeasure,
} from "./measureUtils.js";


function getShoppingItemGroup(item) {
  const parsedItem = parseMeasure(item.measure);

  if (parsedItem === null) {
    return {
      item,
      unitType: "unknown",
      convertedAmount: null,
      amount: null,
      unit: null,
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
  } else if (unitType == "string") {
    convertedAmount = item.measure;
  }

  return {
    item,
    unitType,
    convertedAmount,
    amount: parsedItem.amount,
    unit: parsedItem.unit,
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
    const newUnit = processed.unit;

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
        if (
          processed.unit !== null &&
          processed.amount !== null
        ) {
          const existingMeasure =
            existingItem.unknownMeasures.find(
              (measure) =>
                measure.unit === processed.unit
            );

          if (existingMeasure) {
            existingMeasure.amount +=
              processed.amount;
          } else {
            existingItem.unknownMeasures.push({
              unit: processed.unit,
              amount: processed.amount,
            });
          }
        } else {
          existingItem.rawMeasures.push(
            processed.item.measure
          );
        }
      } else {
        existingItem.amount +=
          processed.convertedAmount;
      }

      existingItem.itemIds.push(
        processed.item.id
      );

      existingItem.statuses.push(
        processed.item.status
      );
    }

    else {
      groupedItems.set(key, {
        name: processed.item.name,
        type: unitType,

        amount:
          unitType === "unknown"
            ? null
            : processed.convertedAmount,

        unknownMeasures:
          unitType === "unknown" &&
            processed.unit !== null
            ? [
              {
                unit: processed.unit,
                amount: processed.amount,
              },
            ]
            : [],

        rawMeasures:
          unitType === "unknown" &&
            processed.unit === null
            ? [processed.item.measure]
            : [],

        itemIds: [processed.item.id],
        statuses: [processed.item.status],
      });
    }
  }



  return [...groupedItems.values()].map((item) => {
    const firstStatus = item.statuses[0];

    const sameStatus = item.statuses.every(
      (status) => status === firstStatus
    );

    return {
      ...item,

      status: sameStatus
        ? firstStatus
        : "mixed",

      measure: formatGroupedMeasure(item),
    };
  });
}