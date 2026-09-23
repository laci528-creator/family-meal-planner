import { Routes, Route } from "react-router-dom";


import Navbar from "./components/Navbar";
import Footer from './components/Footer';
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from './pages/Login';
import Register from './pages/Register';
import MyRecipes from './pages/Recipes';
import WeeklyPlanner from './pages/Planner';
import ShoppingList from './pages/Shopping';
import NotFound from "./pages/NotFound";
import RecipeDetails from "./pages/RecipeDetails";

import './App.css'

function App() {

  return (
      <div className="app">
        <Navbar />
          <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/recipes/:id" element={<RecipeDetails />} />
                <Route
                  path="/recipes"
                  element={
                    <ProtectedRoute>
                      <MyRecipes />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/planner"
                  element={
                    <ProtectedRoute>
                      <WeeklyPlanner />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/shopping"
                  element={
                    <ProtectedRoute>
                      <ShoppingList />
                    </ProtectedRoute>
                  }
                />
                <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
      </div>
  )
}

export default App
