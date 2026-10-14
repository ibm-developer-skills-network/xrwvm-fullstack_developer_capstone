from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
import logging
import time

from .models import CarModel
from .populate import initiate
from .restapis import (
    analyze_review_sentiments,
    get_request,
    post_review,
    service_health,
)


logger = logging.getLogger(__name__)


@csrf_exempt
def login_user(request):
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    user = authenticate(username=username, password=password)
    response_data = {"userName": username}
    if user is not None:
        login(request, user)
        response_data = {
            "userName": username,
            "status": "Authenticated",
        }
    return JsonResponse(response_data)


def logout_request(request):
    logout(request)
    return JsonResponse({"username": ""})


def registration(request):
    data = json.loads(request.body)
    username = data["username"]
    password = data["password"]
    first_name = data["firstname"]
    last_name = data["lastname"]
    email = data['email']

    try:
        User.objects.get(username=username)
        username_exist = True
    except User.DoesNotExist:
        logger.debug("{} is new user".format(username))
        username_exist = False

    if not username_exist:
        user = User.objects.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name,
            password=password,
            email=email,
        )
        login(request, user)
        response_data = {
            "userName": username,
            "status": "Authenticated",
        }
        return JsonResponse(response_data)

    response_data = {
        "userName": username,
        "error": "Already Registered",
    }
    return JsonResponse(response_data)


def get_dealerships(request, state="All"):
    if state == "All":
        endpoint = "/fetchDealers"
    else:
        endpoint = "/fetchDealers/" + state

    dealerships = get_request(endpoint)
    return JsonResponse({"dealers": dealerships})


def get_dealer_reviews(request, dealer_id):
    if dealer_id:
        endpoint = "/fetchReviews/dealer/" + str(dealer_id)
        reviews = get_request(endpoint)
        for review_detail in reviews:
            response = analyze_review_sentiments(review_detail['review'])
            print(response)
            review_detail['sentiment'] = response['sentiment']
        return JsonResponse({"status": 200, "reviews": reviews})
    return JsonResponse({"status": 400, "message": "Bad Request"})


def get_dealer_details(request, dealer_id):
    if dealer_id:
        endpoint = "/fetchDealer/" + str(dealer_id)
        dealership = get_request(endpoint)
        return JsonResponse({"status": 200, "dealer": dealership})
    return JsonResponse({"status": 400, "message": "Bad Request"})


def add_review(request):
    if not request.user.is_anonymous:
        data = json.loads(request.body)
        try:
            post_review(data)
            return JsonResponse({"status": 200})
        except Exception:
            return JsonResponse(
                {"status": 401, "message": "Error in posting review"}
            )
    return JsonResponse({"status": 403, "message": "Unauthorized"})


ANALYZE_MAX_CHARS = 500


@csrf_exempt
@require_POST
def analyze_text(request):
    """Run any text through the sentiment service (home page demo)."""
    try:
        text = json.loads(request.body).get("text", "")
    except (ValueError, AttributeError):
        text = ""
    text = text.strip() if isinstance(text, str) else ""
    if not text:
        return JsonResponse(
            {"error": "Type a sentence to analyze."}, status=400
        )
    if len(text) > ANALYZE_MAX_CHARS:
        return JsonResponse(
            {"error": f"Keep it to {ANALYZE_MAX_CHARS} characters or fewer."},
            status=400,
        )

    started = time.perf_counter()
    result = analyze_review_sentiments(text)
    analyzer_ms = round((time.perf_counter() - started) * 1000)
    if not result or "sentiment" not in result:
        return JsonResponse(
            {"error": "analyzer_unreachable", "analyzer_ms": analyzer_ms},
            status=502,
        )
    return JsonResponse({
        "sentiment": result["sentiment"],
        "scores": result.get("scores"),
        "analyzer_ms": analyzer_ms,
    })


def service_status(request):
    """Health of each backend service, for the home page status strip."""
    return JsonResponse(service_health())


SENTIMENT_ORDER = ("positive", "neutral", "negative")


def sample_reviews(request):
    """One stored review per sentiment label, scored live by the analyzer."""
    reviews = get_request("/fetchReviews")
    if not isinstance(reviews, list):
        return JsonResponse({"error": "express_unreachable"}, status=502)

    dealers = get_request("/fetchDealers")
    names = {}
    if isinstance(dealers, list):
        names = {d["id"]: d.get("full_name") for d in dealers}

    picked = {}
    for review in reviews:
        if len(picked) == len(SENTIMENT_ORDER):
            break
        result = analyze_review_sentiments(review["review"])
        if not result or "sentiment" not in result:
            return JsonResponse({"error": "analyzer_unreachable"}, status=502)
        label = result["sentiment"]
        if label in picked:
            continue
        picked[label] = {
            "id": review["id"],
            "name": review["name"],
            "review": review["review"],
            "dealership": review["dealership"],
            "dealer_name": names.get(review["dealership"]),
            "car": " ".join(
                str(review[k]) for k in ("car_year", "car_make", "car_model")
                if review.get(k)
            ),
            "purchase": review.get("purchase"),
            "sentiment": label,
            "scores": result.get("scores"),
        }
    return JsonResponse({
        "reviews": [picked[s] for s in SENTIMENT_ORDER if s in picked],
    })


def get_cars(request):
    count = CarModel.objects.filter().count()
    print(count)
    if count == 0:
        initiate()
    car_models = CarModel.objects.select_related('car_make')
    cars = []
    for car_model in car_models:
        cars.append({
            "CarModel": car_model.name,
            "CarMake": car_model.car_make.name,
        })
    return JsonResponse({"CarModels": cars})
