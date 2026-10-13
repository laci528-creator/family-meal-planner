import {
  parseAmount,
  parseMeasure,
  convertWeightToGrams,
  convertVolumeToMl,
  getMeasureType,
} from "./measureUtils.js";


console.log("--- parseAmount ---");

console.log(parseAmount("2"));       // 2
console.log(parseAmount("1/2"));     // 0.5
console.log(parseAmount("1 1/2"));   // 1.5
console.log(parseAmount("2.5"));     // 2.5


console.log("--- parseMeasure ---");

console.log(parseMeasure("500 g"));
// { amount: 500, unit: "g" }

console.log(parseMeasure("500g"));
// { amount: 500, unit: "g" }

console.log(parseMeasure("1/2 lb"));
// { amount: 0.5, unit: "lb" }

console.log(parseMeasure("1 1/2 kg"));
// { amount: 1.5, unit: "kg" }

console.log(parseMeasure("2 cups"));
// { amount: 2, unit: "cups" }

console.log(parseMeasure("to taste"));
// null


console.log("--- weight ---");

console.log(convertWeightToGrams("500 g"));
// 500

console.log(convertWeightToGrams("1 kg"));
// 1000

console.log(convertWeightToGrams("2 oz"));
// kb. 56.699

console.log(convertWeightToGrams("1/2 lb"));
// kb. 226.796

console.log(convertWeightToGrams("2 cups"));
// null


console.log("--- volume ---");

console.log(convertVolumeToMl("500 ml"));
// 500

console.log(convertVolumeToMl("1 l"));
// 1000

console.log(convertVolumeToMl("2 cups"));
// 480

console.log(convertVolumeToMl("3 tbsp"));
// 45

console.log(convertVolumeToMl("2 kg"));
// null


console.log("--- measure type ---");

console.log(getMeasureType("kg"));
// weight

console.log(getMeasureType("grams"));
// weight

console.log(getMeasureType("cup"));
// volume

console.log(getMeasureType("tbsp"));
// volume

console.log(getMeasureType("clove"));
// unknown