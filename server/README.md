# Backend

The backend is three services that work together:

1. **Django app** (`djangoproj/`, `djangoapp/`): handles users and sessions, stores car makes and models, serves the built React frontend, and exposes the `/djangoapp/*` JSON API the frontend calls.
2. **Dealer/review API** (`database/`): an Express + Mongoose service backed by MongoDB that stores dealerships and reviews.
3. **Sentiment analyzer** (`djangoapp/microservices/`): a Flask service that labels review text as positive, neutral or negative.

The browser only ever talks to Django. Django calls the other two services over HTTP.

## Django app

### Setup

```bash
cd server
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser   # optional, for /admin
python manage.py runserver
```

The site runs on http://localhost:8000. Build the frontend first (`cd frontend && npm run build`); Django serves pages from `frontend/build` and `frontend/static`.

### Configuration

`djangoapp/restapis.py` reads two settings from the environment or from `djangoapp/.env`:

| Variable | Default | Points to |
| --- | --- | --- |
| `backend_url` | `http://localhost:3030` | Dealer/review API |
| `sentiment_analyzer_url` | `http://localhost:5050/` | Sentiment analyzer (keep the trailing slash) |

Other settings in `djangoproj/settings.py` that you may need to change:

- `ALLOWED_HOSTS` and `CSRF_TRUSTED_ORIGINS`: add your domain when deploying.
- `SECRET_KEY` and `DEBUG`: `DEBUG` is `True` and the secret key is committed, so change both before production.
- `DATABASES`: SQLite at `server/db.sqlite3`.

### Data model

Stored in SQLite (`djangoapp/models.py`):

- **CarMake**: `name`, `description`
- **CarModel**: `car_make` (foreign key to CarMake), `name`, `type` (`Sedan`, `SUV` or `Wagon`), `year` (2015–2023)

The first request to `/djangoapp/get_cars` seeds these tables from `djangoapp/populate.py` if they are empty. Users are stored with Django's built-in `User` model.

### API

All endpoints are under `/djangoapp/` and return JSON.

| Method | Path | Description |
| --- | --- | --- |
| POST | `/login` | Log in. Body: `{"userName", "password"}` |
| GET | `/logout` | Log out the current session |
| POST | `/register` | Create an account and log in. Body: `{"username", "password", "firstname", "lastname", "email"}` |
| GET | `/get_dealers` | All dealerships |
| GET | `/get_dealers/<state>` | Dealerships in one state, for example `/get_dealers/Kansas` |
| GET | `/dealer/<dealer_id>` | One dealership |
| GET | `/reviews/dealer/<dealer_id>` | A dealership's reviews, each with a `sentiment` field added |
| POST | `/add_review` | Post a review (signed-in users only) |
| GET | `/get_cars` | All car models with their make |

### Page routes

`djangoproj/urls.py` maps page URLs to templates. `/`, `/about/`, `/login/`, `/logout/`, `/register/`, `/dealers/`, `/dealer/<id>` and `/postreview/<id>` all render the React `index.html`, and React Router picks the page. `/contact/` redirects to `/about/`. `/admin/` is the Django admin.

## Dealer/review API (`database/`)

An Express server on port 3030 with MongoDB. On every start it clears the `dealerships` and `reviews` collections and reloads them from `data/dealerships.json` and `data/reviews.json`, so reviews posted at runtime are lost on restart.

### Run with Docker

```bash
cd server/database
docker build -t nodeapp .
docker compose up
```

`docker-compose.yml` starts MongoDB (`mongo_db`, port 27017, data in the `mongo_data` volume) and the API (port 3030). The API connects to `mongodb://mongo_db:27017/`, so run it through Compose rather than directly with `node app.js`.

### Endpoints

| Method | Path | Description |
| --- | --- | --- |
| GET | `/fetchDealers` | All dealerships |
| GET | `/fetchDealers/:state` | Dealerships in a state |
| GET | `/fetchDealer/:id` | One dealership |
| GET | `/fetchReviews` | All reviews |
| GET | `/fetchReviews/dealer/:id` | Reviews for a dealership |
| POST | `/insert_review` | Add a review (raw JSON body) |

Mongoose schemas live in `dealership.js`, `review.js` and `inventory.js`.

## Sentiment analyzer (`djangoapp/microservices/`)

A Flask app that runs NLTK's VADER analyzer on text.

```bash
cd server/djangoapp/microservices
docker build -t sentiment .
docker run -p 5050:5000 sentiment
```

`GET /analyze/<text>` returns `{"sentiment": "positive" | "neutral" | "negative"}`, whichever VADER score is highest. The VADER lexicon ships as `sentiment/vader_lexicon.zip`.

## Linting

CI runs these on every push and pull request to `main`:

```bash
flake8 .                                          # Python
npx jshint database/*.js                          # Node service
```
