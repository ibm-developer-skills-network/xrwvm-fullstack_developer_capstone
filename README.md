# Dealership Reviews — Project Definition

A full-stack car dealership review application. Visitors browse dealerships (optionally by state), open a dealer's detail page, read customer reviews with sentiment indicators, and — after registering/logging in — post a new review. Static Home/About/Contact pages are served by Django; the interactive SPA is React.

This repository is based on the IBM Developer Skills Network `xrwvm-fullstack_developer_capstone` template and was developed in milestones (static pages → user management → backend services → dynamic pages → CI/CD).

## Architecture

Four runtime services plus a browser client:

| Component | Stack | Port | Responsibility |
| --- | --- | --- | --- |
| Web host / API gateway | Django, Gunicorn (WSGI) in production | 8000 | Static templates, built React app, Django sessions/auth, JSON endpoints that proxy backend services, SQLite car catalog |
| Dealership API | Node.js 18, Express 4, Mongoose 8 | 3030 | MongoDB CRUD for dealerships and reviews |
| Database | MongoDB (+ Mongo Express UI) | 27017 / 8081 | Dealership and review documents |
| Sentiment service | Flask, NLTK VADER | 5050 | `GET /analyze/<text>` → positive / negative / neutral |
| Client | React 18 (CRA), react-router-dom 6 | 3000 (dev) | Login, registration, dealer list/detail, review submission |

Review flow: React → Django `/djangoapp/reviews/dealer/<id>` → Express `/fetchReviews/dealer/<id>` (MongoDB) → Django calls Flask `/analyze/<text>` for each review → React renders review text with a sentiment icon.

Data: `server/database/data/` seeds MongoDB (`dealerships.json`, `reviews.json`) and Django's SQLite (`car_records.json`, 214 cars).

## Repository layout

- `README.md` — original template stub; this document (`REDME.md`) holds the project definition.
- `.github/workflows/main.yml` — CI/CD: flake8, jshint, frontend build, Django check, three Docker builds, optional IBM Cloud/kind deploy.
- `deployment.yml` — Kubernetes manifests: 5 Deployments + 5 ClusterIP Services.
- `scripts/` — `setup-kind.sh`, `deploy-kubernetes.sh`, `deploy-code-engine.sh`.
- `.flake8`, `.jshintrc` — lint configuration; root `package.json` supplies jshint.
- `server/` — Docker build context for the Django web service:
  - `djangoproj/` — settings, root URLconf, WSGI/ASGI entry points.
  - `djangoapp/` — auth/API views, outbound REST clients (`restapis.py`), SQLite models, seed script, `.env`, and `microservices/` (Flask sentiment service).
  - `database/` — Express app, Mongoose models, seed data, Dockerfile, docker-compose.
  - `frontend/` — React SPA (`src/`), committed production `build/`, static templates and assets.

## Entry points

- Django dev: `python server/manage.py runserver`; production: `gunicorn djangoproj.wsgi:application --bind 0.0.0.0:8000`.
- Express: `node app.js` from `server/database` (seed JSON files are resolved from the process working directory).
- Flask: `python3 app.py` from `server/djangoapp/microservices`.
- React: `npm start` / `npm run build` in `server/frontend`.
- Kubernetes: `bash scripts/setup-kind.sh && bash scripts/deploy-kubernetes.sh`.

## Routes

Django pages: `/`, `/about/`, `/contact/`, plus SPA routes `/login`, `/register`, `/dealers`, `/dealer/<id>`, `/postreview/<id>` and `/admin/`.

Django JSON API:
- `POST /djangoapp/register`, `POST /djangoapp/login`, `GET /djangoapp/logout`
- `GET /djangoapp/get_dealers[/<state>]`, `GET /djangoapp/dealer/<id>`
- `GET /djangoapp/reviews/dealer/<id>`, `POST /djangoapp/add_review` (login required)
- `GET /djangoapp/get_cars`

Express API: `GET /`, `/fetchReviews`, `/fetchReviews/dealer/:id`, `/fetchDealers`, `/fetchDealers/:state`, `/fetchDealer/:id`, `POST /insert_review`.

Sentiment API: `GET /`, `GET /analyze/<input_txt>`.

## Configuration

- `backend_url` — Express base URL (default `http://localhost:3030`; Kubernetes `http://dealership-api:3030`).
- `sentiment_analyzer_url` — Flask base URL (default `http://localhost:5050/`; Kubernetes `http://sentiment-analyzer:5050`).
- `MONGO_URI` — MongoDB connection (compose default `mongodb://mongo_db:27017/`; Kubernetes `mongodb://mongo-db:27017/dealershipsDB`).
- `PORT`, `NLTK_DATA` — Flask port and VADER data path.
- Deployment/CI: `KIND_CLUSTER_NAME`, `IBM_CLOUD_API_KEY`, `IBM_CLOUD_REGION`, `IBM_CLOUD_RESOURCE_GROUP`, `IBM_CODE_ENGINE_PROJECT`, `KUBE_CONFIG` (GitHub Secrets).

## Development setup

```bash
python -m pip install -r server/requirements.txt
python server/manage.py migrate
python server/manage.py runserver                 # :8000
docker compose -f server/database/docker-compose.yml up --build   # Mongo + API + Mongo Express
python -m pip install -r server/djangoapp/microservices/requirements.txt
python server/djangoapp/microservices/app.py      # :5050
cd server/frontend && npm install && npm start     # :3000
```

Lint: `flake8 .` and `npx jshint server/database`. CI additionally runs `npm run build --prefix server/frontend` and `python server/manage.py check`. There are no automated test files; the CI "Build and Test" job performs build and validation only.
