CREATE TABLE IF NOT EXISTS users (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_role_check
    CHECK (role IN ('user', 'admin'))
);

CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique
ON users (LOWER(email));


CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    user_id INTEGER NOT NULL
        REFERENCES users(id)
        ON DELETE CASCADE,

    external_id VARCHAR(50),

    title VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    cuisine VARCHAR(100),

    instructions TEXT,

    image_url TEXT,

    source VARCHAR(20) NOT NULL DEFAULT 'custom',

    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT recipes_source_check
        CHECK (source IN ('api', 'custom'))
);


CREATE UNIQUE INDEX IF NOT EXISTS recipes_user_external_unique
ON recipes (user_id, external_id)
WHERE source = 'api' AND external_id IS NOT NULL;


CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS ingredients_name_unique
ON ingredients (LOWER(name));


CREATE TABLE IF NOT EXISTS recipe_ingredients (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,

    recipe_id INTEGER NOT NULL
        REFERENCES recipes(id)
        ON DELETE CASCADE,

    ingredient_id INTEGER NOT NULL
        REFERENCES ingredients(id),

    measure VARCHAR(100)
);