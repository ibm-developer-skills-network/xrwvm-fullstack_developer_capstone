import logging
import os
from urllib.parse import quote

import requests
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

backend_url = os.getenv(
    'backend_url', default='http://localhost:3030')
sentiment_analyzer_url = os.getenv(
    'sentiment_analyzer_url',
    default='http://localhost:5050/')


def get_request(endpoint, **kwargs):
    request_url = f'{backend_url.rstrip("/")}/{endpoint.lstrip("/")}'
    try:
        response = requests.get(request_url, params=kwargs, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as error:
        logger.error('GET %s failed: %s', request_url, error)
        return None


def analyze_review_sentiments(text):
    request_url = f'{sentiment_analyzer_url.rstrip("/")}/analyze/{quote(str(text), safe="")}'
    try:
        response = requests.get(request_url, timeout=10)
        response.raise_for_status()
        return response.json().get('sentiment', 'neutral')
    except requests.RequestException as error:
        logger.error('Sentiment analysis failed: %s', error)
        return 'neutral'


def post_review(data_dict):
    request_url = f'{backend_url.rstrip("/")}/insert_review'
    try:
        response = requests.post(request_url, json=data_dict, timeout=10)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as error:
        logger.error('POST %s failed: %s', request_url, error)
        return None
