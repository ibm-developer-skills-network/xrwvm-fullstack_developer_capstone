# Uncomment the required imports before adding the code

# from django.shortcuts import render
# from django.http import HttpResponseRedirect, HttpResponse
# from django.contrib.auth.models import User
# from django.shortcuts import get_object_or_404, render, redirect
# from django.contrib.auth import logout
# from django.contrib import messages
# from datetime import datetime

from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
import logging
import json
from django.views.decorators.csrf import csrf_exempt

from .models import CarModel
from .populate import initiate
from .restapis import analyze_review_sentiments, get_request, post_review


# Get an instance of a logger
logger = logging.getLogger(__name__)


# Create your views here.

# Create a `login_request` view to handle sign in request
@csrf_exempt
def login_user(request):
    # Get username and password from request.POST dictionary
    data = json.loads(request.body)
    username = data['userName']
    password = data['password']
    # Try to check if provide credential can be authenticated
    user = authenticate(username=username, password=password)
    data = {"userName": username}
    if user is not None:
        # If user is valid, call login method to login current user
        login(request, user)
        data = {"userName": username, "status": "Authenticated"}
    return JsonResponse(data)

def logout_request(request):
    logout(request)
    return JsonResponse({"userName": "", "status": "Logged out"})


@csrf_exempt
def registration(request):
    data = json.loads(request.body)
    username = data.get("userName")
    password = data.get("password")
    if not username or not password:
        return JsonResponse({"error": "Username and password are required"})

    if User.objects.filter(username=username).exists():
        return JsonResponse({"userName": username, "error": "Username already exists"})

    user = User.objects.create_user(
        username=username,
        password=password,
        first_name=data.get("firstName", ""),
        last_name=data.get("lastName", ""),
        email=data.get("email", ""),
    )
    login(request, user)
    return JsonResponse({"userName": username, "status": True})

@csrf_exempt
def get_dealerships(request, state='All'):
    if request.method != 'GET':
        return JsonResponse({'status': 405, 'dealers': []})
    if state in ('All', '', None):
        endpoint = '/fetchDealers'
    else:
        endpoint = f'/fetchDealers/{state}'
    dealerships = get_request(endpoint) or []
    return JsonResponse({'status': 200, 'dealers': dealerships})


@csrf_exempt
def get_dealer_details(request, dealer_id):
    if request.method != 'GET':
        return JsonResponse({'status': 405, 'dealer': []})
    dealer = get_request(f'/fetchDealer/{dealer_id}') or []
    return JsonResponse({'status': 200, 'dealer': dealer})


@csrf_exempt
def get_dealer_reviews(request, dealer_id):
    if request.method != 'GET':
        return JsonResponse({'status': 405, 'reviews': []})
    reviews = get_request(f'/fetchReviews/dealer/{dealer_id}') or []
    for review in reviews:
        review['sentiment'] = analyze_review_sentiments(
            review.get('review', ''))
    return JsonResponse({'status': 200, 'reviews': reviews})


@csrf_exempt
def add_review(request):
    if not request.user.is_authenticated:
        return JsonResponse({'status': 403, 'error': 'Authentication required'})
    if request.method != 'POST':
        return JsonResponse({'status': 405, 'error': 'Method not allowed'})
    try:
        data = json.loads(request.body)
    except (ValueError, TypeError):
        return JsonResponse({'status': 400, 'error': 'Invalid JSON'})
    if post_review(data) is None:
        return JsonResponse({'status': 500, 'error': 'Error inserting review'})
    return JsonResponse({'status': 200})


@csrf_exempt
def get_cars(request):
    if not CarModel.objects.exists():
        initiate()
    car_models = CarModel.objects.select_related(
        'car_make').values_list('car_make__name', 'name')
    return JsonResponse({
        'CarModels': [
            {'CarMake': make, 'CarModel': model} for make, model in car_models
        ]
    })

