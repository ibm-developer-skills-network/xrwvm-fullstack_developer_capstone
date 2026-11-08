import os
from urllib.parse import quote

import requests
from dotenv import load_dotenv

load_dotenv()

backend_url = os.getenv(
    'backend_url', default="http://localhost:3030")
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default="http://localhost:5050/")


def get_request(endpoint, **kwargs):
    """GET from the Express/Mongo backend and return the parsed JSON."""
    request_url = backend_url.rstrip('/') + endpoint
    print("GET from {} ".format(request_url))
    try:
        response = requests.get(request_url, params=kwargs, timeout=15)
        return response.json()
    except Exception as err:
        print("Network exception occurred: {}".format(err))
        return []


def analyze_review_sentiments(text):
    """Call the sentiment microservice; fall back to 'neutral'."""
    safe_text = quote(text.replace("/", " "), safe="")
    request_url = (
        sentiment_analyzer_url.rstrip('/') + "/analyze/" + safe_text)
    try:
        response = requests.get(request_url, timeout=15)
        return response.json()
    except Exception as err:
        print("Unexpected {}, {}".format(err, type(err)))
        print("Network exception occurred")
        return {"sentiment": "neutral"}


def post_review(data_dict):
    """POST a review to the Express/Mongo backend."""
    request_url = backend_url.rstrip('/') + "/insert_review"
    response = requests.post(request_url, json=data_dict, timeout=15)
    response.raise_for_status()
    print(response.json())
    return response.json()
