# Family Meal Planner

A full-stack meal planning application built with React, Node.js, Express and PostgreSQL.

> 🚧 This project is currently under active development.

## About the Project

Family Meal Planner is a web application designed to make weekly meal planning and grocery shopping easier.

Users can discover recipes, save recipes to their personal collection, create their own family recipes, plan meals for the week and generate a shopping list based on the selected meals.

The project was created as a portfolio project and as a practical application for everyday meal planning.

## Current Features

- User registration and login
- Session-based authentication
- Protected routes
- Recipe search using TheMealDB API
- Random recipe discovery
- Save recipes from the external API
- Create custom family recipes
- Edit and delete custom recipes
- View saved recipe details
- Weekly meal planner
- Breakfast, lunch and dinner planning
- Previous, current and next week navigation
- Add meals to the planner
- Change planned meals
- Delete planned meals
- Generate shopping list ingredients from the weekly meal planner
- Weekly shopping list navigation
- Shopping item status controls:
  - Needed
  - At home
  - Purchased

## In Development

The project is still being actively developed.

Current and planned improvements include:

- Persistent shopping list items
- Saving shopping item status in the database
- Manual shopping list items
- Shopping item deletion
- Shopping list regeneration from the meal planner
- Meal plan completeness check before generating a shopping list
- Improved responsive design
- Better mobile layout
- Shopping list ingredient grouping
- Improved shopping list synchronization

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express
- PostgreSQL
- express-session
- bcrypt

### External API

- TheMealDB

## Main Application Areas

### Recipe Discovery

Users can search for recipes using TheMealDB API and view recipe details.

Recipes can be saved to the user's personal recipe collection.

### Family Recipes

Users can create their own custom family recipes.

Custom recipes can be edited and deleted later.

### Weekly Meal Planner

The planner displays one week at a time.

Each day contains three meal slots:

- Breakfast
- Lunch
- Dinner

Users can:

- Add a recipe
- Change a planned recipe
- Delete a planned meal
- Navigate between previous, current and future weeks

### Shopping List

The application can collect ingredients from recipes used in the weekly meal planner.

The shopping list supports weekly navigation and currently includes status controls for:

- Needed
- At home
- Purchased

Shopping list persistence and synchronization are currently under development.

## Database

The application currently uses the following main tables:

- `users`
- `recipes`
- `ingredients`
- `recipe_ingredients`
- `meal_plan_entries`
- `shopping_list_items`

## Project Structure

```text
family-meal-planner/
├── client/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       └── utils/
│
└── server/
    ├── database/
    └── src/
        ├── config/
        ├── controllers/
        ├── middleware/
        ├── routes/
        ├── services/
        └── utils/