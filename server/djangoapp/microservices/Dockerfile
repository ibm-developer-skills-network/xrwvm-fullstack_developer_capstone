FROM python:3.9.18-slim-bookworm

WORKDIR /python-docker

COPY requirements.txt requirements.txt
RUN pip3 install --no-cache-dir -r requirements.txt
COPY . .

ENV NLTK_DATA=/python-docker

EXPOSE 5050

CMD ["python3", "app.py"]
