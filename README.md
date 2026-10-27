# Family Meal Planner

> 🚧 This project is currently under active development.

A full-stack meal planning application built with React, Node.js, Express and PostgreSQL.

**Live Demo:**  
https://family-meal-planner-ewy5.onrender.com

This README is available in English and German.

---

# English

## Overview

Family Meal Planner is a full-stack web application designed to make weekly meal planning and grocery shopping easier.

Users can discover recipes, save recipes to their personal collection, create and manage their own family recipes, plan breakfast, lunch and dinner for an entire week, and automatically generate a shopping list from the selected meals.

The application also includes pantry management, image uploads, cooking progress tracking and multiple visual themes.

The project was originally started as a practical application for everyday family use and as a birthday gift for my wife. At the same time, it became a larger portfolio project for practising full-stack web development with React, Node.js, Express and PostgreSQL.

## Features

### Authentication

* User registration
* User login and logout
* Password hashing with bcrypt
* Session-based authentication
* PostgreSQL-backed session storage
* Protected application routes
* User-specific recipes, meal plans, shopping lists and pantry items
* Persistent login session across page refreshes

### Recipe Discovery

* Search recipes using TheMealDB API
* Random daily recipe inspiration
* View detailed recipe information
* Display category and cuisine information
* Display ingredients and measurements
* Display recipe instructions
* Placeholder image for recipes without an available image
* Loading, empty and error states

### Saved Recipes

* Save recipes from TheMealDB
* User-specific recipe collection
* Prevent duplicate saved API recipes
* View saved recipe details
* Delete saved recipes
* Customize previously saved API recipes
* Keep external recipes available through the original API search

### Family Recipes

* Create custom family recipes
* Add recipe title, category, cuisine and instructions
* Add up to multiple ingredients
* Structured ingredient amount and unit fields
* Supported measurement units such as:
  * mg
  * g
  * kg
  * ml
  * l
  * tsp
  * tbsp
  * cup
  * piece
  * cloves
  * slices
* Edit existing family recipes
* Delete family recipes
* Upload recipe images
* JPEG, PNG and WebP image support
* Cloudinary image storage and optimization
* Automatic placeholder image when no image is available

### Cooking Mode

* Start a dedicated cooking mode from recipe instructions
* Instructions are separated into individual cooking steps
* Mark completed instruction steps
* Highlight the current cooking step
* Save cooking progress in LocalStorage
* Continue cooking after refreshing the page
* Separate progress tracking for individual recipes
* Reset cooking progress

### Weekly Meal Planner

* Weekly calendar view
* Breakfast, lunch and dinner slots for every day
* Add recipes to meal slots
* Change already planned meals
* Delete planned meals
* Previous week navigation
* Current week navigation
* Next week navigation
* Highlight the current day
* User-specific meal planning data
* Loading, success and error feedback

### Shopping List

* Automatically generate a shopping list from the weekly meal planner
* Refresh an existing shopping list from planner data
* Preserve manually added shopping items when refreshing
* Combine duplicate ingredients
* Combine compatible ingredient measurements
* Normalize supported weight and volume units
* Group ingredient quantities
* Weekly shopping list navigation
* Add manual shopping items
* Delete shopping items
* Shopping item status management:
  * Needed
  * At home
  * Purchased
* Persist shopping item status in PostgreSQL
* Warn when the weekly meal planner is not completely filled before generating the list
* User-specific shopping lists

### Pantry

* Add pantry staples
* Remove pantry items
* Prevent duplicate pantry entries
* Case-insensitive and trimmed duplicate checking
* Automatically exclude pantry ingredients from generated shopping lists
* Ingredients reappear in generated shopping lists after being removed from the pantry
* User-specific pantry data

### User Interface

* Responsive desktop and mobile layout
* Responsive navigation
* Mobile hamburger menu
* Recipe dropdown navigation
* Reusable status messages for:
  * Success
  * Error
  * Information
* Empty and loading states
* Multiple selectable visual themes
* Theme preference stored locally
* DM Sans typography
* Custom 404 page

## Technologies

### Frontend

* React
* JavaScript
* Vite
* React Router
* React Context API
* Axios
* LocalStorage
* HTML5
* CSS3
* Responsive design
* DM Sans

### Backend

* Node.js
* Express.js
* REST API
* express-session
* connect-pg-simple
* bcrypt
* multer
* CORS
* dotenv

### Database

* PostgreSQL
* pg
* Foreign keys
* CHECK constraints
* Unique indexes
* User-specific relational data
* PostgreSQL session storage

### External Services

* TheMealDB – recipe data
* Cloudinary – uploaded recipe images and image optimization

### Deployment

* Render – React frontend
* Vercel – Node.js / Express backend
* Neon – hosted PostgreSQL database
* Cloudinary – image storage

## Database Structure

The application uses the following main database tables:

* `users` – registered users and authentication-related user data
* `recipes` – saved API recipes and custom family recipes
* `ingredients` – normalized ingredient names
* `recipe_ingredients` – relation between recipes and ingredients including measurements
* `meal_plan_entries` – weekly breakfast, lunch and dinner planning
* `shopping_list_items` – generated and manually added shopping items
* `pantry_staples` – user-specific pantry ingredients
* `user_sessions` – persistent server-side login sessions

Relationships between application data are managed using PostgreSQL foreign keys and database constraints.

## Architecture

```text
React + Vite Frontend
        │
        │ HTTPS / REST API
        ▼
Node.js + Express Backend
        │
        ├── TheMealDB API
        │
        ├── Cloudinary
        │
        ▼
PostgreSQL Database
        │
        ├── User data
        ├── Recipes
        ├── Meal plans
        ├── Shopping lists
        ├── Pantry
        └── Sessions
```

The production application uses a separately deployed frontend and backend.

The frontend communicates with the Express REST API using Axios with credentials enabled. Authentication sessions are stored server-side in PostgreSQL.

## Project Structure

```text
family-meal-planner/
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── pages/
│       ├── services/
│       └── utils/
│
├── server/
│   ├── database/
│   │   └── init.sql
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       └── utils/
│
├── package.json
└── README.md
```

## Project Goal

The goal of this project was to develop a larger practical full-stack application that combines several areas of modern web development.

The project demonstrates:

* React component-based frontend development
* React state and Context API
* Client-side routing
* REST API communication
* External API integration
* User authentication
* Server-side sessions
* PostgreSQL relational database design
* User-specific data management
* CRUD operations
* File uploads
* Cloud-based image storage
* Weekly date handling
* Data aggregation
* Ingredient and measurement normalization
* Responsive design
* Error and loading state handling
* Frontend and backend deployment

A particular focus of the project was connecting multiple features into one practical workflow:

```text
Discover or create recipe
        ↓
Save recipe
        ↓
Add recipe to weekly planner
        ↓
Generate shopping list
        ↓
Remove pantry staples
        ↓
Manage shopping status
```

## Running the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/laci528-creator/family-meal-planner.git
cd family-meal-planner
```

### 2. Install root dependencies

```bash
npm install
```

### 3. Install frontend dependencies

```bash
cd client
npm install
```

### 4. Install backend dependencies

```bash
cd ../server
npm install
```

### 5. Create the PostgreSQL database

Create a PostgreSQL database for the project.

The required database structure can be created using:

```text
server/database/init.sql
```

### 6. Configure backend environment variables

Create a `.env` file inside the `server` directory.

Example:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=family_meal_planner

SESSION_SECRET=your_session_secret

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

For production environments, the backend can also use:

```env
DATABASE_URL=your_postgresql_connection_string
```

If `DATABASE_URL` is available, the application uses it instead of the individual local database variables.

### 7. Frontend API configuration

During local development, Vite proxies `/api` requests to:

```text
http://localhost:3000
```

For a production frontend build, configure:

```env
VITE_API_URL=https://your-backend-domain.example/api
```

### 8. Start the application

Return to the project root:

```bash
cd ..
```

Start frontend and backend together:

```bash
npm run dev
```

The frontend runs by default at:

```text
http://localhost:5173
```

The backend runs by default at:

```text
http://localhost:3000
```

## Live Demo

The production version is available here:

https://family-meal-planner-evy5.onrender.com

The demo uses individual user accounts. Recipes, meal plans, shopping lists and pantry data are therefore separated by user.

---

# Deutsch

## Überblick

Family Meal Planner ist eine Full-Stack-Webanwendung zur einfacheren Planung von Mahlzeiten und Einkäufen für eine ganze Woche.

Benutzer können Rezepte entdecken, Rezepte in ihrer persönlichen Sammlung speichern, eigene Familienrezepte erstellen und bearbeiten, Frühstück, Mittagessen und Abendessen für die Woche planen und daraus automatisch eine Einkaufsliste generieren.

Zusätzlich bietet die Anwendung eine Vorratsverwaltung, Bild-Uploads, einen Cooking Mode und mehrere auswählbare Designs.

Das Projekt wurde ursprünglich als praktische Anwendung für den Familienalltag und als Geburtstagsgeschenk für meine Frau begonnen. Gleichzeitig entwickelte es sich zu einem umfangreicheren Portfolio-Projekt, mit dem ich Full-Stack-Webentwicklung mit React, Node.js, Express und PostgreSQL praktisch vertiefen konnte.

## Funktionen

### Authentifizierung

* Benutzerregistrierung
* Benutzeranmeldung und Abmeldung
* Passwort-Hashing mit bcrypt
* Session-basierte Authentifizierung
* Speicherung der Sessions in PostgreSQL
* Geschützte Anwendungsrouten
* Benutzerbezogene Rezepte, Wochenpläne, Einkaufslisten und Vorräte
* Beibehaltung der Anmeldung nach einer Seitenaktualisierung

### Rezeptsuche

* Suche nach Rezepten über die TheMealDB API
* Zufällige tägliche Rezeptempfehlung
* Detailansicht einzelner Rezepte
* Anzeige von Kategorie und Küche
* Anzeige von Zutaten und Mengenangaben
* Anzeige der Zubereitungsanleitung
* Platzhalterbild bei fehlendem Rezeptbild
* Lade-, Leer- und Fehlerzustände

### Gespeicherte Rezepte

* Rezepte aus TheMealDB speichern
* Persönliche Rezeptsammlung pro Benutzer
* Vermeidung doppelter gespeicherter API-Rezepte
* Detailansicht gespeicherter Rezepte
* Gespeicherte Rezepte löschen
* Gespeicherte API-Rezepte individuell anpassen
* Das ursprüngliche externe Rezept bleibt weiterhin über die API-Suche verfügbar

### Familienrezepte

* Eigene Familienrezepte erstellen
* Titel, Kategorie, Küche und Zubereitungsanleitung eingeben
* Mehrere Zutaten hinzufügen
* Strukturierte Eingabe von Menge und Einheit
* Unterstützte Maßeinheiten wie:
  * mg
  * g
  * kg
  * ml
  * l
  * tsp
  * tbsp
  * cup
  * piece
  * cloves
  * slices
* Familienrezepte bearbeiten
* Familienrezepte löschen
* Rezeptbilder hochladen
* Unterstützung für JPEG, PNG und WebP
* Speicherung und Optimierung der Bilder über Cloudinary
* Automatisches Platzhalterbild bei fehlendem Bild

### Cooking Mode

* Spezieller Kochmodus für Rezeptanweisungen
* Aufteilung der Anleitung in einzelne Schritte
* Erledigte Schritte markieren
* Aktuellen Kochschritt hervorheben
* Speicherung des Fortschritts im LocalStorage
* Fortsetzen des Kochfortschritts nach einer Seitenaktualisierung
* Separater Fortschritt für einzelne Rezepte
* Kochfortschritt zurücksetzen

### Wochenplaner

* Wochenansicht
* Frühstück, Mittagessen und Abendessen für jeden Tag
* Rezepte zu Mahlzeiten hinzufügen
* Bereits geplante Mahlzeiten ändern
* Mahlzeiten löschen
* Navigation zur vorherigen Woche
* Navigation zur aktuellen Woche
* Navigation zur nächsten Woche
* Hervorhebung des aktuellen Tages
* Benutzerbezogene Wochenplanung
* Lade-, Erfolgs- und Fehlermeldungen

### Einkaufsliste

* Automatische Erstellung einer Einkaufsliste aus dem Wochenplan
* Aktualisierung einer vorhandenen Einkaufsliste anhand des Wochenplans
* Manuell hinzugefügte Einträge bleiben beim Aktualisieren erhalten
* Zusammenfassen doppelter Zutaten
* Zusammenfassen kompatibler Mengenangaben
* Normalisierung unterstützter Gewichts- und Volumeneinheiten
* Gruppierung von Zutatenmengen
* Wöchentliche Navigation der Einkaufsliste
* Manuelle Einkaufseinträge hinzufügen
* Einkaufseinträge löschen
* Statusverwaltung:
  * Needed
  * At home
  * Purchased
* Speicherung des Einkaufsstatus in PostgreSQL
* Warnung, wenn der Wochenplan vor der Generierung noch nicht vollständig ausgefüllt ist
* Benutzerbezogene Einkaufslisten

### Vorratsliste

* Vorratsartikel hinzufügen
* Vorratsartikel löschen
* Doppelte Vorratseinträge verhindern
* Groß-/Kleinschreibung und Leerzeichen bei Duplikaten berücksichtigen
* Vorratszutaten automatisch aus generierten Einkaufslisten ausschließen
* Nach dem Entfernen aus der Vorratsliste erscheinen Zutaten wieder in neu generierten Einkaufslisten
* Benutzerbezogene Vorratsdaten

### Benutzeroberfläche

* Responsives Desktop- und Mobil-Layout
* Responsive Navigation
* Hamburger-Menü für mobile Geräte
* Rezept-Dropdown-Menü
* Wiederverwendbare Statusmeldungen für:
  * Erfolg
  * Fehler
  * Information
* Lade- und Leerzustände
* Mehrere auswählbare Farbschemata
* Lokale Speicherung der Designauswahl
* DM-Sans-Schriftart
* Eigene 404-Seite

## Verwendete Technologien

### Frontend

* React
* JavaScript
* Vite
* React Router
* React Context API
* Axios
* LocalStorage
* HTML5
* CSS3
* Responsives Design
* DM Sans

### Backend

* Node.js
* Express.js
* REST API
* express-session
* connect-pg-simple
* bcrypt
* multer
* CORS
* dotenv

### Datenbank

* PostgreSQL
* pg
* Foreign Keys
* CHECK Constraints
* Unique Indexes
* Benutzerbezogene relationale Daten
* PostgreSQL Session Storage

### Externe Dienste

* TheMealDB – Rezeptdaten
* Cloudinary – Speicherung und Optimierung hochgeladener Rezeptbilder

### Deployment

* Render – React-Frontend
* Vercel – Node.js-/Express-Backend
* Neon – gehostete PostgreSQL-Datenbank
* Cloudinary – Bildspeicherung

## Datenbankstruktur

Die Anwendung verwendet folgende zentrale Tabellen:

* `users` – registrierte Benutzer
* `recipes` – gespeicherte API-Rezepte und eigene Familienrezepte
* `ingredients` – normalisierte Zutaten
* `recipe_ingredients` – Verknüpfung von Rezepten und Zutaten inklusive Mengenangaben
* `meal_plan_entries` – geplante Mahlzeiten für Frühstück, Mittagessen und Abendessen
* `shopping_list_items` – automatisch generierte und manuell hinzugefügte Einkaufseinträge
* `pantry_staples` – benutzerbezogene Vorratszutaten
* `user_sessions` – serverseitig gespeicherte Login-Sessions

Die Beziehungen zwischen den Anwendungsdaten werden über PostgreSQL Foreign Keys und Constraints verwaltet.

## Architektur

```text
React + Vite Frontend
        │
        │ HTTPS / REST API
        ▼
Node.js + Express Backend
        │
        ├── TheMealDB API
        │
        ├── Cloudinary
        │
        ▼
PostgreSQL-Datenbank
        │
        ├── Benutzerdaten
        ├── Rezepte
        ├── Wochenplanung
        ├── Einkaufslisten
        ├── Vorräte
        └── Sessions
```

Frontend und Backend werden in der Produktionsversion getrennt bereitgestellt.

Das Frontend kommuniziert über Axios mit aktivierten Credentials mit der Express REST API. Die Authentifizierungs-Sessions werden serverseitig in PostgreSQL gespeichert.

## Projektziel

Ziel dieses Projekts war es, eine umfangreichere praktische Full-Stack-Anwendung zu entwickeln und mehrere Bereiche moderner Webentwicklung miteinander zu verbinden.

Das Projekt demonstriert unter anderem:

* Komponentenbasierte Frontend-Entwicklung mit React
* React State und Context API
* Clientseitiges Routing
* REST-API-Kommunikation
* Integration einer externen API
* Benutzer-Authentifizierung
* Serverseitige Sessions
* Relationales Datenbankdesign mit PostgreSQL
* Benutzerbezogene Datenverwaltung
* CRUD-Operationen
* Datei-Uploads
* Cloudbasierte Bildspeicherung
* Verarbeitung von Kalenderwochen und Datumswerten
* Datenaggregation
* Normalisierung von Zutaten und Maßeinheiten
* Responsives Design
* Fehler- und Ladezustände
* Deployment von Frontend und Backend

Ein besonderer Schwerpunkt lag darauf, mehrere Funktionen zu einem zusammenhängenden praktischen Workflow zu verbinden:

```text
Rezept entdecken oder erstellen
        ↓
Rezept speichern
        ↓
Zum Wochenplan hinzufügen
        ↓
Einkaufsliste generieren
        ↓
Vorratszutaten herausfiltern
        ↓
Einkaufsstatus verwalten
```

## Projekt lokal starten

### 1. Repository klonen

```bash
git clone https://github.com/laci528-creator/family-meal-planner.git
cd family-meal-planner
```

### 2. Abhängigkeiten im Hauptverzeichnis installieren

```bash
npm install
```

### 3. Frontend-Abhängigkeiten installieren

```bash
cd client
npm install
```

### 4. Backend-Abhängigkeiten installieren

```bash
cd ../server
npm install
```

### 5. PostgreSQL-Datenbank erstellen

Eine PostgreSQL-Datenbank für das Projekt erstellen.

Die benötigte Datenbankstruktur kann mit folgender Datei angelegt werden:

```text
server/database/init.sql
```

### 6. Backend-Umgebungsvariablen konfigurieren

Im `server`-Verzeichnis eine `.env`-Datei erstellen.

Beispiel:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=family_meal_planner

SESSION_SECRET=your_session_secret

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Für eine Produktionsumgebung kann alternativ eine vollständige PostgreSQL-Verbindungsadresse verwendet werden:

```env
DATABASE_URL=your_postgresql_connection_string
```

Wenn `DATABASE_URL` vorhanden ist, verwendet die Anwendung diese anstelle der einzelnen lokalen Datenbankvariablen.

### 7. Frontend-API-Konfiguration

Während der lokalen Entwicklung leitet Vite `/api`-Anfragen an folgende Adresse weiter:

```text
http://localhost:3000
```

Für einen Production-Build kann folgende Variable gesetzt werden:

```env
VITE_API_URL=https://your-backend-domain.example/api
```

### 8. Anwendung starten

Zurück ins Hauptverzeichnis wechseln:

```bash
cd ..
```

Frontend und Backend gemeinsam starten:

```bash
npm run dev
```

Das Frontend läuft standardmäßig unter:

```text
http://localhost:5173
```

Das Backend läuft standardmäßig unter:

```text
http://localhost:3000
```

## Live Demo

Die Live-Version ist hier verfügbar:

https://family-meal-planner-evy5.onrender.com

Die Demo verwendet individuelle Benutzerkonten. Rezepte, Wochenpläne, Einkaufslisten und Vorratsdaten sind daher nach Benutzer getrennt.