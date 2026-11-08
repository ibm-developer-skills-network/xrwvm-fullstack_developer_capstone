from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from . import views

app_name = 'djangoapp'
urlpatterns = [
    # path for registration
    path(route='register', view=views.registration, name='register'),

    # path for login / logout
    path(route='login', view=views.login_user, name='login'),
    path(route='logout', view=views.logout_request, name='logout'),

    # path for the list of cars
    path(route='get_cars', view=views.get_cars, name='getcars'),

    # paths for dealers (all, or by state)
    path(route='get_dealers', view=views.get_dealerships,
         name='get_dealers'),
    path(route='get_dealers/<str:state>', view=views.get_dealerships,
         name='get_dealers_by_state'),

    # path for dealer details and dealer reviews
    path(route='dealer/<int:dealer_id>', view=views.get_dealer_details,
         name='dealer_details'),
    path(route='reviews/dealer/<int:dealer_id>',
         view=views.get_dealer_reviews, name='dealer_details_reviews'),

    # path for add a review view
    path(route='add_review', view=views.add_review, name='add_review'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
