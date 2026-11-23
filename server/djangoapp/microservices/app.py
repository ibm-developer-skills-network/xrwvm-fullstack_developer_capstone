import json
import os
from pathlib import Path

from flask import Flask
from nltk.sentiment import SentimentIntensityAnalyzer

nltk_data_path = str(Path(__file__).resolve().parent)
existing_nltk_data = os.environ.get('NLTK_DATA')
os.environ['NLTK_DATA'] = (
    nltk_data_path if not existing_nltk_data
    else f'{nltk_data_path}{os.pathsep}{existing_nltk_data}'
)

app = Flask("Sentiment Analyzer")
sia = SentimentIntensityAnalyzer()


@app.get('/')
def home():
    return "Welcome to the Sentiment Analyzer. \
    Use /analyze/text to get the sentiment"


@app.get('/analyze/<input_txt>')
def analyze_sentiment(input_txt):

    scores = sia.polarity_scores(input_txt)
    print(scores)
    pos = float(scores['pos'])
    neg = float(scores['neg'])
    neu = float(scores['neu'])
    res = "positive"
    print("pos neg nue ", pos, neg, neu)
    if (neg > pos and neg > neu):
        res = "negative"
    elif (neu > neg and neu > pos):
        res = "neutral"
    res = json.dumps({"sentiment": res})
    print(res)
    return res


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", "5050")))
