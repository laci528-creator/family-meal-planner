import { Routes, Route } from "react-router-dom";


import Navbar from "./components/Navbar";
import Footer from './components/Footer';

import Home from "./pages/Home";
import Login from './pages/Login';
import Register from './pages/Register';
import MyRecipes from './pages/Recipes';
import WeeklyPlanner from './pages/Planner';
import ShoppingList from './pages/Shopping';
import NotFound from "./pages/NotFound";

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
                <Route path="/recipes" element={<MyRecipes />} />
                <Route path="/planner" element={<WeeklyPlanner />} />
                <Route path="/shopping" element={<ShoppingList />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
      </div>
  )
}

export default App
