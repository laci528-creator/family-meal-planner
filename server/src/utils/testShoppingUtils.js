import { groupShoppingItems } from "./shoppingUtils.js";

const items = [
  {
    id: 1,
    name: "Beef",
    measure: "500 g",
  },
  {
    id: 2,
    name: "Beef",
    measure: "1 kg",
  },

  {
    id: 3,
    name: "Milk",
    measure: "1 cup",
  },
  {
    id: 4,
    name: "Milk",
    measure: "250 ml",
  },

  {
    id: 5,
    name: "Garlic",
    measure: "2 cloves",
  },
  {
    id: 6,
    name: "Garlic",
    measure: "1 bulb",
  },

  {
    id: 7,
    name: "Flour",
    measure: "500 g",
  },
  {
    id: 8,
    name: "Flour",
    measure: "1 cup",
  },
];

console.log(
  JSON.stringify(
    groupShoppingItems(items),
    null,
    2
  )
);