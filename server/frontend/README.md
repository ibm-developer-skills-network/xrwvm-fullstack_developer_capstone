# Frontend

The React single-page app for the dealership site. It is built into static files that the Django server serves; it has no server of its own in production.

## Stack

- React 19 with React Router 6
- [HeroUI](https://heroui.com) v3 and Tailwind CSS v4 on the home page
- Bootstrap and plain CSS on the other pages
- Create React App (`react-scripts`) for the dev server and build

## Pages

| Route | Component | Description |
| --- | --- | --- |
| `/` | `components/Home/Home.jsx` | Landing page: hero, body-style tabs, featured dealers |
| `/about` | `components/About/About.jsx` | About this project: what is real, the four services, model limits |
| `/login` | `components/Login/Login.jsx` | Sign in |
| `/register` | `components/Register/Register.jsx` | Create an account |
| `/dealers` | `components/Dealers/Dealers.jsx` | Dealership list with a state filter |
| `/dealer/:id` | `components/Dealers/Dealer.jsx` | One dealership and its reviews |
| `/postreview/:id` | `components/Dealers/PostReview.jsx` | Review form (signed-in users) |

`/contact` permanently redirects to `/about`.

Django only sends `index.html` for paths listed in `server/djangoproj/urls.py`, so every route above needs a matching entry there. When you add or rename a route, update both files and any links to it; otherwise the page loads blank or returns a 404.

Every route is lazy-loaded in `src/App.js`. This keeps each page's CSS separate: the home page uses Tailwind and HeroUI, the other pages use Bootstrap, and the two style sheets conflict if loaded together.

## Getting started

```bash
npm install
npm run build
```

Then run Django from `server/` (`python manage.py runserver`) and open http://localhost:8000. Django serves `build/index.html` for the app routes and handles the `/djangoapp/*` API calls on the same origin.

`npm start` runs the CRA dev server on http://localhost:3000 with hot reload. That is fine for working on layout, but the dev server has no proxy to Django, so API calls (dealers, login, reviews) fail there.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run build` | Compiles Tailwind CSS, then builds the app into `build/` |
| `npm start` | Compiles Tailwind CSS, then starts the dev server |
| `npm run watch:css` | Rebuilds Tailwind CSS on change; run alongside `npm start` while editing the home page |
| `npm test` | Runs tests with Jest and React Testing Library |

### Tailwind CSS

Tailwind is compiled by the Tailwind CLI, not by CRA. `src/styles/tailwind.css` is the input and `src/styles/home.generated.css` is the output, which is git-ignored. `npm start` and `npm run build` compile it first through their `pre` scripts.

## Project structure

```
frontend/
├── public/              # index.html template, favicon, manifest
├── static/              # Legacy Bootstrap assets served by Django
└── src/
    ├── App.js           # Routes
    ├── index.js         # Entry point, wraps App in BrowserRouter
    ├── styles/          # Tailwind input (and generated output)
    └── components/
        ├── Home/        # Landing page (HeroUI + Tailwind)
        ├── Header/      # Nav bar for the Bootstrap pages
        ├── Login/
        ├── Register/
        ├── Dealers/     # Dealer list, dealer detail, post review
        └── assets/      # Bootstrap, shared CSS, icons
```
