function AboutProject() {
  return (
    <section
      className="about-project"
      id="about"
    >
      <h2>About this project</h2>

      <p className="about-project-text">
        Family Meal Planner is a full-stack web
        application designed to make weekly meal
        planning and grocery shopping easier.
      </p>

      <p className="about-project-text">
        I started this project as a birthday gift
        for my wife, with the goal of creating
        something useful for our everyday life.
        At the same time, it helps me improve my
        full-stack development skills and serves
        as a practical portfolio project.
      </p>

      <h3>Main features</h3>

      <ul className="about-project-list">
        <li>Search and save recipes</li>
        <li>Create and manage family recipes</li>
        <li>Plan meals for the week</li>
        <li>Generate weekly shopping lists</li>
        <li>Combine duplicate ingredients and measurements</li>
        <li>Mark shopping items as at home or purchased</li>
        <li>Manage pantry staples</li>
      </ul>

      <h3>Technologies</h3>

      <p className="about-project-stack">
        React, React Router, Node.js, Express,
        PostgreSQL and Axios.
      </p>
    </section>
  );
}

export default AboutProject;