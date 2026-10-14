from flask import Flask, jsonify, request
from nltk.sentiment import SentimentIntensityAnalyzer
app = Flask("Sentiment Analyzer")

sia = SentimentIntensityAnalyzer()

# Standard VADER thresholds on the normalized compound score (-1 to 1).
POSITIVE_THRESHOLD = 0.05
NEGATIVE_THRESHOLD = -0.05


def classify(text):
    scores = sia.polarity_scores(text)
    compound = scores['compound']
    if compound >= POSITIVE_THRESHOLD:
        sentiment = "positive"
    elif compound <= NEGATIVE_THRESHOLD:
        sentiment = "negative"
    else:
        sentiment = "neutral"
    return {"sentiment": sentiment, "scores": scores}


@app.get('/')
def home():
    return "Welcome to the Sentiment Analyzer. \
    Use /analyze/text to get the sentiment"


@app.get('/analyze/<input_txt>')
def analyze_sentiment(input_txt):
    return jsonify(classify(input_txt))


@app.post('/analyze')
def analyze_sentiment_body():
    data = request.get_json(silent=True) or {}
    text = data.get('text')
    if not isinstance(text, str) or not text.strip():
        return jsonify({"error": "Provide some text to analyze."}), 400
    return jsonify(classify(text))


if __name__ == "__main__":
    app.run(debug=True)
