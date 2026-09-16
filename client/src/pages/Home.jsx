import { Link } from 'react-router-dom';

function Home() {
  return (
    <section className="home-page">
      <div className="home-hero">
        <h1 className="home-title">Plan meals. Shop smarter.</h1>

        <p className="home-description">
          Discover recipes, save family favourites, plan your week
          and create your shopping list automatically.
        </p>
      </div>

      <div className="home-features">
        <article className="feature-card">
          <h2>Discover Recipes</h2>
          <p>Find new recipes and save your favourites.</p>
          <div className="button-container">
          <Link to="/recipes" className="primary-button">Discover recipes</Link>
          </div>
        </article>

        <article className="feature-card">
          <h2>Family Recipes</h2>
          <p>Keep your own and traditional family recipes in one place.</p>
          <div className="button-container">
          <Link to="/recipes" className="primary-button">View recipes</Link>
          </div>
        </article>

        <article className="feature-card">
          <h2>Weekly Planner</h2>
          <p>Plan your meals for the upcoming week.</p>
          <div className="button-container">
          <Link to="/planner" className="primary-button">Plan your week</Link>
          </div>
        </article>

        <article className="feature-card">
          <h2>Shopping List</h2>
          <p>Create a shopping list automatically from your meal plan.</p>
          <div className="button-container">
          <Link to="/shopping" className="primary-button">View shopping list</Link>
          </div>
        </article>
      </div>
    </section>
  );
}

export default Home;