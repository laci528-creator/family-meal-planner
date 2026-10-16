import { groupShoppingItems } from "./shoppingUtils.js";

const items = [
  {
    id: 1,
    name: "Beef",
    measure: "500 g",
    status: "needed",
  },
  {
    id: 2,
    name: "Beef",
    measure: "1 kg",
    status: "needed",
  },

  {
    id: 3,
    name: "Milk",
    measure: "1 cup",
    status: "needed",
  },
  {
    id: 4,
    name: "Milk",
    measure: "250 ml",
    status: "needed",
  },

  {
    id: 5,
    name: "Garlic",
    measure: "2 cloves",
    status: "needed",
  },
  {
    id: 6,
    name: "Garlic",
    measure: "1 bulb",
    status: "purchased",
  },

  {
    id: 7,
    name: "Flour",
    measure: "500 g",
    status: "needed",
  },
  {
    id: 8,
    name: "Flour",
    measure: "1 cup",
    status: "purchased",
  },
    {
    id: 9,
    name: "salt",
    measure: "To taste",
    status: "needed",
  },
    {
    id: 10,
    name: "Salt",
    measure: "to taste",
    status: "purchased",
  },
    {
    id: 11,
    name: "Buns",
    measure: "3",
    status: "needed",
  },
    {
    id: 12,
    name: "Buns",
    measure: "5",
    status: "needed",
  },
];

console.log(
  JSON.stringify(
    groupShoppingItems(items),
    null,
    2
  )
);