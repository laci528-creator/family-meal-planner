const unitAliases = {
  mg: "mg",
  g: "g",
  kg: "kg",

  ml: "ml",
  l: "l",

  tsp: "tsp",
  teaspoon: "tsp",
  teaspoons: "tsp",

  tbsp: "tbsp",
  tablespoon: "tbsp",
  tablespoons: "tbsp",

  cup: "cup",
  cups: "cup",

  lb: "lb",
  lbs: "lb",
  pound: "lb",
  pounds: "lb",

  oz: "oz",
  ounce: "oz",
  ounces: "oz",

  piece: "piece",
  pieces: "piece",

  clove: "cloves",
  cloves: "cloves",

  slice: "slices",
  slices: "slices",
};

export function splitMeasure(measure = "") {
  const trimmedMeasure = measure.trim();

  if (!trimmedMeasure) {
    return {
      amount: "",
      unit: "",
    };
  }

  const match = trimmedMeasure.match(
    /^([\d./\s]+)\s*([a-zA-Z]+)?$/
  );

  if (!match) {
    return {
      amount: trimmedMeasure,
      unit: "",
    };
  }

  const amount = match[1].trim();
  const rawUnit =
    match[2]?.toLowerCase() || "";

  const unit = unitAliases[rawUnit];

  if (!unit) {
    return {
      amount: trimmedMeasure,
      unit: "",
    };
  }

  return {
    amount,
    unit,
  };
}