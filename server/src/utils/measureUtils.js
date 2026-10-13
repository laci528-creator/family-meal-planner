

export function parseAmount(value) {
  if (value.includes(" ")) {
    const parts = value.trim().split(/\s+/);

    if (parts.length === 2 && parts[1].includes("/")) {
      const whole = Number(parts[0]);
      const [numerator, denominator] =
        parts[1].split("/").map(Number);

      return whole + numerator / denominator;
    }
  }

  if (value.includes("/")) {
    const [numerator, denominator] =
      value.split("/").map(Number);

    return numerator / denominator;
  }

  return Number(value);
}


export function parseMeasure(measure) {

if (
    typeof measure !== "string" ||
    measure.trim() === ""
  ) {
    return null;
  }

  const match = measure
    .trim()
    .match(/^([\d./\s]+)\s*([a-zA-Z]+)$/);

  if (!match) {
    return null;
  }

  const amountText = match[1].trim();
  const unit = match[2].toLowerCase();

  const amount = parseAmount(amountText);

  if (!Number.isFinite(amount)) {
    return null;
}

  return {
    amount,
    unit,
  };
}

const WEIGHT_UNITS = {
  mg: 0.001,
  milligram: 0.001,
  milligrams: 0.001,

  g: 1,
  gram: 1,
  grams: 1,

  kg: 1000,
  kilogram: 1000,
  kilograms: 1000,

  oz: 28.3495,
  ounce: 28.3495,
  ounces: 28.3495,

  lb: 453.592,
  lbs: 453.592,
  pound: 453.592,
  pounds: 453.592,
};

const VOLUME_UNITS = {
  ml: 1,

  cl: 10,
  dl: 100,

  l: 1000,
  litre: 1000,
  litres: 1000,

  tsp: 5,
  teaspoon: 5,
  teaspoons: 5,

  tbsp: 15,
  tbs: 15,
  tblsp: 15,
  tbls: 15,
  tablespoon: 15,
  tablespoons: 15,

  cup: 240,
  cups: 240,
};


export function convertWeightToGrams(measure) {
  const parsed = parseMeasure(measure);

  if (!parsed) {
    return null;
  }

  const { amount, unit } = parsed;

  const gramFactor = WEIGHT_UNITS[unit];

if (gramFactor === undefined) {
  return null;
}

  return amount * gramFactor;
}

export function convertVolumeToMl(measure) {
  const parsed = parseMeasure(measure);

  if (!parsed) {
    return null;
  }

  const { amount, unit } = parsed;

  const mlFactor = VOLUME_UNITS[unit];

  if (mlFactor === undefined) {
    return null;
  }

  return amount * mlFactor;
}

export function getMeasureType(unit) {
  if (
    typeof unit !== "string" ||
    unit.trim() === ""
  ) {
    return null;
  }

  const lowerUnit = unit.trim().toLowerCase();

  if (lowerUnit in WEIGHT_UNITS) {
    return "weight";
  }

  if (lowerUnit in VOLUME_UNITS) {
    return "volume";
  }

  return "unknown";
}