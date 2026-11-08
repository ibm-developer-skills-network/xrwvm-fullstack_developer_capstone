# Best Cars Dealership: Build, CI/CD and Containerize Guide

Everything under `server/`, `.github/` and the root config files in this bundle
drops into your fork of `xrwvm-fullstack_developer_capstone`
(same folder paths, so copy over the skeleton and overwrite).

## File map

| Lab | Files |
|---|---|
| 1. Static pages | `server/djangoproj/settings.py`, `server/djangoproj/urls.py`, `server/frontend/static/{About,Contact,Home}.html`, `README.md` |
| 2. User management | `server/djangoapp/{views,urls}.py`, `server/frontend/src/App.js`, `server/frontend/src/components/Register/Register.jsx` |
| 3. Car models | `server/djangoapp/{models,admin,populate}.py` (+ `get_cars` in `views.py`) |
| 4. Dynamic pages | `server/djangoapp/{restapis,views,urls}.py`, `server/database/app.js`, `server/frontend/src/App.js`, `server/djangoapp/.env` |
| 5. CI/CD | `.github/workflows/main.yml`, `.flake8`, `/*jshint esversion: 8 */` header in `server/database/*.js` |
| 6. Containers | `server/Dockerfile`, `server/entrypoint.sh`, `server/deployment.yaml`, `server/.dockerignore` |

Not changed (already in the skeleton): `Dealers.jsx`, `Dealer.jsx`, `PostReview.jsx`,
`Header.jsx`, `Login.jsx`.

---

## Part A. Run the application

### A1. Fork, clone, copy the code
```bash
git clone https://github.com/<you>/xrwvm-fullstack_developer_capstone.git
cd xrwvm-fullstack_developer_capstone
# copy this bundle's files over the repo (keep folder paths), then:
git config --global user.email "you@email.com"
git config --global user.name "your name"
```

### A2. Python environment and database
```bash
cd server
pip install virtualenv
virtualenv djangoenv
source djangoenv/bin/activate
python3 -m pip install -U -r requirements.txt
python3 manage.py makemigrations
python3 manage.py migrate --run-syncdb
```

### A3. Allowed hosts (lab step "ALLOWED_HOSTS / CSRF_TRUSTED_ORIGINS")
Either edit the two lists in `settings.py`, or export them before `runserver`
(no trailing `/`; CSRF origins need the scheme):
```bash
export DJANGO_ALLOWED_HOSTS="<your-app-host>"
export DJANGO_CSRF_TRUSTED_ORIGINS="https://<your-app-host>"
```

### A4. Superuser (root/root for the reviewer)
```bash
DJANGO_SUPERUSER_PASSWORD=root python3 manage.py createsuperuser \
  --noinput --username root --email root@example.com
```

### A5. Backend services
The dealer list and reviews come from the Express/Mongo service, and
sentiment comes from the Flask microservice.
```bash
# Express + MongoDB (new terminal)
cd server/database
docker build . -t nodeapp
docker-compose up
```
Edit `server/djangoapp/.env` (the sentiment URL must end with `/`):
```
backend_url=http://localhost:3030
sentiment_analyzer_url=https://<your-code-engine-sentiment-url>/
```
If you changed `.env` after starting Django, restart Django.

### A6. Build the React front end
```bash
cd server/frontend
npm install
npm run build        # re-run after every change to src/
```

### A7. Start Django and test
```bash
cd server
python3 manage.py runserver
```
Open port 8000 and check:

| Check | URL |
|---|---|
| Home / About / Contact | `/`, `/about`, `/contact` |
| Admin (root/root) | `/admin` |
| Login / register / logout | `/login`, `/register`, Logout link on the header |
| Cars API | `/djangoapp/get_cars` (first call populates 5 makes and 15 models) |
| Dealers | `/dealers`, `/djangoapp/get_dealers`, `/djangoapp/get_dealers/Texas` |
| Dealer + reviews | `/dealer/15` |
| Post review | `/postreview/15` (logged in) |

Assessment artifacts (curl commands from the labs):
```bash
curl -X POST "<Django-URL>/djangoapp/login" -H "Content-Type: application/json" \
  -d '{"userName": "<user>", "password": "<password>"}'      # -> loginuser
curl -X GET "<Django-URL>/djangoapp/logout"                   # -> logoutuser
curl -X GET "<Django-URL>/djangoapp/get_cars"                 # -> getallcarmakes
```
Commit and push as you go:
```bash
git add . && git commit -m "Complete labs 1-4" && git push
```

---

## Part B. CI/CD with GitHub Actions (Lab 5)

1. Make sure `.github/workflows/main.yml` and `.flake8` from this bundle are in
   the repo root, and commit/push them:
   ```bash
   git add .github .flake8 server
   git commit -m "Add lint workflow"
   git push
   ```
   Pushing to `main` triggers the workflow. (Alternative from the lab: GitHub
   > Actions > "Set up a workflow yourself", paste `main.yml`, Commit changes.)
2. Open the **Actions** tab. You should see two jobs, *Lint Python Files*
   (flake8) and *Lint JavaScript Files* (JSHint). Green tick = success.
3. If a job is red, open the log. The code here is already written to pass:
   - Python: lines <= 79 chars, two blank lines between functions, no unused
     imports. Generated `migrations/` and `djangoenv/` are skipped.
   - JavaScript: `/*jshint esversion: 8 */` is the first line of every file in
     `server/database/`, semicolons are present and keys use dot notation.
4. Assessment (Option 1, AI-graded). Install and log in to the GitHub CLI:
   ```bash
   sudo apt update && sudo apt install gh
   gh auth login
   ```
   Choose GitHub.com, HTTPS, `Y`, "Paste an authentication token". The PAT
   needs the scopes `repo`, `read:org`, `workflow`.
5. Clone your repo (if needed), then list and view the latest run:
   ```bash
   cd xrwvm-fullstack_developer_capstone
   gh run list                      # pick your own repo if asked
   gh run view <run-id> --verbose
   ```
6. Save the terminal output of `gh run view` to a text file named `CI/CD`.
   Option 2 (peer-graded): screenshot the successful run as `CI/CD.png`.

Tip: run the linters locally before pushing:
```bash
pip install flake8 && find . -name "*.py" -not -path "*/migrations/*" -not -path "*/djangoenv/*" -exec flake8 {} +
npm i -g jshint && find ./server/database -name "*.js" -exec jshint {} +
```

---

## Part C. Containerize and deploy to Kubernetes (Lab 6)

1. **Environment.** Clone the repo if the lab was reset, start Mongo Express
   (`server/database`, see A5), make sure the sentiment service is up, then
   build the front end (the image copies `frontend/build`):
   ```bash
   cd server/frontend && npm install && npm run build
   ```
2. **Dockerfile and entrypoint.** `server/Dockerfile` and `server/entrypoint.sh`
   are provided. `entrypoint.sh` runs `makemigrations`, `migrate` and
   `collectstatic`, then `exec "$@"` starts gunicorn on port 8000. (Two small
   fixes versus the lab text: `PYTHONUNBUFFERED` / `PYTHONDONTWRITEBYTECODE`
   are spelled correctly, and `ENV KEY=value` syntax is used.)
3. **Registry namespace.**
   ```bash
   MY_NAMESPACE=$(ibmcloud cr namespaces | grep sn-labs-)
   echo $MY_NAMESPACE
   ```
4. **Build and push** (run from `server/`):
   ```bash
   cd server
   docker build -t us.icr.io/$MY_NAMESPACE/dealership .
   docker push us.icr.io/$MY_NAMESPACE/dealership
   ```
   Optional local smoke test: `docker run --rm -p 8000:8000 us.icr.io/$MY_NAMESPACE/dealership`
5. **Deployment file.** Insert your namespace into `deployment.yaml`:
   ```bash
   sed -i "s|your-name-space|$MY_NAMESPACE|" deployment.yaml
   ```
   Also set `DJANGO_ALLOWED_HOSTS` / `DJANGO_CSRF_TRUSTED_ORIGINS` in the file to
   the URL you will use. Env vars in the manifest override `.env`, so set
   `backend_url` and `sentiment_analyzer_url` there if the pod can't reach
   `localhost:3030` (the Express service runs in your terminal, not in the
   pod). Use a URL reachable from the cluster.
6. **Deploy and expose.**
   ```bash
   kubectl apply -f deployment.yaml
   kubectl get pods                      # wait for Running
   kubectl port-forward deployment.apps/dealership 8000:8000
   ```
   If you get an error, wait a bit and rerun the port-forward.
7. **Open the app.** Use the "Dealership Application" button or Skills Network
   Toolbox > OTHER > Launch Application, port `8000`. Then log in, view the
   dealers, add a review, and log out.
8. **Submission.**
   - Save the deployed URL in a text file named `deploymentURL`.
   - Screenshots (address bar visible, same URL): `deployed_landingpage`,
     `deployed_loggedin` (username visible), `deployed_dealer_detail`,
     `deployed_add_review` (review plus sentiment). Use `.png` or `.jpeg`.
   - The SQLite DB (with your registered user) is baked into the image, so log
     in with a user you created earlier.

Useful debugging commands:
```bash
kubectl logs deployment/dealership
kubectl describe pod -l run=dealership
kubectl rollout restart deployment/dealership   # after pushing a new image
```
