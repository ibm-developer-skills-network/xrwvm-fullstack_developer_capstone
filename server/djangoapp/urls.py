from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'
urlpatterns = [
    path(route='register', view=views.registration, name='register'),
    path(route='login', view=views.login_user, name='login'),
    path(route='logout', view=views.logout_request, name='logout'),
    path(route='get_dealers', view=views.get_dealerships, name='get_dealerships'),
    path(route='get_dealers/<str:state>', view=views.get_dealerships,
         name='get_dealerships_by_state'),
    path(route='dealer/<int:dealer_id>', view=views.get_dealer_details,
         name='get_dealer_details'),
    path(route='reviews/dealer/<int:dealer_id>', view=views.get_dealer_reviews,
         name='get_dealer_reviews'),
    path(route='add_review', view=views.add_review, name='add_review'),
    path(route='get_cars', view=views.get_cars, name='get_cars'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
