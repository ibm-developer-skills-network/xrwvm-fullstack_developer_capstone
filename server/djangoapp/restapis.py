# Uncomment the imports below before you add the function code
import requests
import os
import time
from urllib.parse import quote
from dotenv import load_dotenv

load_dotenv()

backend_url = os.getenv(
    'backend_url', default="http://localhost:3030")
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="http://localhost:5050/")


def get_request(endpoint, **kwargs):
    params = ""

    if (kwargs):
        for key, value in kwargs.items():
            params = params + key + "=" + value + "&"

    request_url = backend_url + endpoint + "?" + params

    print("GET from {} ".format(request_url))

    try:
        response = requests.get(request_url)
        return response.json()
    except (requests.RequestException, ValueError):
        print("Network exception occurred")
        return {"message": "Network exception occurred"}


def analyze_review_sentiments(text):
    # POST keeps arbitrary review text (slashes, '?', '#') out of the URL.
    request_url = sentiment_analyzer_url + "analyze"

    try:
        response = requests.post(request_url, json={"text": text}, timeout=10)
        if response.status_code in (404, 405):
            # Analyzer deployments that predate POST /analyze.
            response = requests.get(
                request_url + "/" + quote(text, safe=""), timeout=10
            )
        response.raise_for_status()
        return response.json()
    except (requests.RequestException, ValueError) as err:
        print(f"Unexpected {err=}, {type(err)=}")
        print("Network exception occurred")


def ping(url, timeout=2):
    """Return (reachable, milliseconds) for a quick GET health check."""
    started = time.perf_counter()
    try:
        response = requests.get(url, timeout=timeout)
        ok = response.ok
    except requests.RequestException:
        ok = False
    return ok, round((time.perf_counter() - started) * 1000)


def service_health():
    # /fetchDealer/1 goes through Express to MongoDB: it proves the data path.
    express_ok, express_ms = ping(backend_url + "/fetchDealer/1")
    flask_ok, flask_ms = ping(sentiment_analyzer_url)
    return {
        "express": {"ok": express_ok, "ms": express_ms},
        "flask": {"ok": flask_ok, "ms": flask_ms},
    }


def post_review(data_dict):
    request_url = backend_url + "/insert_review"
    try:
        response = requests.post(request_url, json=data_dict)
        print(response.json())
        return response.json()
    except (requests.RequestException, ValueError):
        print("Network exception occurred")
