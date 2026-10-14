# Uncomment the imports before you add the code
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'
urlpatterns = [
    # # path for registration
    path(route='register', view=views.registration, name='registration'),

    # path for login
    path(route='login', view=views.login_user, name='login'),

    path(route='logout', view=views.logout_request, name='logout'),

    # path for dealer reviews view
    path(route='get_dealers', view=views.get_dealerships, name='get_dealers'),
    path(
        route='get_dealers/<str:state>',
        view=views.get_dealerships,
        name='get_dealers_by_state',
    ),
    path(
        route='dealer/<int:dealer_id>',
        view=views.get_dealer_details,
        name='dealer_details',
    ),

    # path for add a review view
    path(
        route='reviews/dealer/<int:dealer_id>',
        view=views.get_dealer_reviews,
        name='dealer_details',
    ),
    path(route='add_review', view=views.add_review, name='add_review'),

    path(route='get_cars', view=views.get_cars, name='getcars'),

    # path for the home page sentiment demo
    path(route='analyze', view=views.analyze_text, name='analyze'),
    path(route='status', view=views.service_status, name='status'),
    path(
        route='reviews/sample',
        view=views.sample_reviews,
        name='sample_reviews',
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
