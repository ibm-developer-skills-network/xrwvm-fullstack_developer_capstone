# Best Cars Dealership

A full-stack car dealership web application that allows visitors to explore dealerships and vehicle information, create accounts, sign in, and share dealership reviews. The application combines a Django web backend and React frontend with dedicated services for dealer data and review sentiment analysis.

## Features

- **Dealership browsing:** View available dealerships and filter results by state.
- **Dealer details:** Explore dealership information and read customer reviews.
- **User accounts:** Register, log in, and log out.
- **Customer reviews:** Submit reviews for dealerships and view submitted feedback.
- **Sentiment analysis:** Analyze review text and return a sentiment result.
- **Car information:** Retrieve car makes and models.
- **Admin interface:** Manage application data through the Django administration site.
- **CI/CD:** Run automated Python and JavaScript checks with GitHub Actions.
- **Containerization:** Build and run the application using Docker, with deployment configuration for Kubernetes.

## Technology Stack

| Area | Technologies |
|------|-------------|
| Backend | Python, Django, Django REST Framework |
| Frontend | React, JavaScript, HTML, CSS |
| Dealer data service | Node.js, Express.js, MongoDB |
| Sentiment analysis | Python, Flask |
| API communication | REST APIs, JSON, cURL |
| CI/CD | GitHub Actions, flake8, JSHint |
| Deployment | Docker, Kubernetes |

## Requirements

- Python 3
- Node.js and npm
- MongoDB and Docker
- Git
- A modern web browser

## Getting Started

Clone the repository:

```bash
git clone https://github.com/NguyenBao-dev/xrwvm-fullstack_developer_capstone.git
cd xrwvm-fullstack_developer_capstone
```

### Backend setup

```bash
cd server
python -m venv djangoenv

# Windows
djangoenv\Scripts\activate

# macOS / Linux
source djangoenv/bin/activate

pip install -r requirements.txt
python manage.py migrate --run-syncdb
```

### Start the dealer data service

From the repository root, open a separate terminal:

```bash
cd server/database
docker-compose up --build
```

Make sure MongoDB is available and configure the service URLs in `server/djangoapp/.env` according to your local environment.

### Frontend setup

Open another terminal:

```bash
cd server/frontend
npm install
npm run build
```

### Run the application

```bash
cd server
python manage.py runserver
```

Open `http://127.0.0.1:8000/` in your browser. The Django admin interface is available at `http://127.0.0.1:8000/admin/`.

> The application also relies on the Flask sentiment-analysis service. Configure its URL in the Django environment settings and make sure the service is running before testing review sentiment analysis.

## Project Structure

```text
xrwvm-fullstack_developer_capstone/
├── .github/
│   └── workflows/          # GitHub Actions workflows
├── server/
│   ├── djangoproj/         # Django project configuration
│   ├── djangoapp/          # Django application, views and REST APIs
│   ├── database/           # Express and MongoDB dealer data service
│   ├── frontend/           # React application and static pages
│   ├── screenshots/        # Application screenshots
│   └── requirements.txt    # Python dependencies
├── .flake8                 # Python lint configuration
├── GUIDE.md                # Development and deployment guide
└── README.md
```

## Screenshots

The application screenshots are available in the [`server/screenshots`](https://github.com/NguyenBao-dev/xrwvm-fullstack_developer_capstone/tree/main/server/screenshots) directory.

## License

This project is for educational and development purposes. See [LICENSE](LICENSE) for details.
