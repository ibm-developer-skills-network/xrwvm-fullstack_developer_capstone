# Uncomment the imports before you add the code
from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'
urlpatterns = [
    # # path for registration
    path(route='register', view=views.registration, name='register'),

    # path for login
<<<<<<< HEAD
    path(route='login', view=views.login_user, name='login'),

    # path for logout
    path(route='logout', view=views.logout_request, name='logout'),
=======
      path("login", view=views.login_user, name='login'),
      path("logout", view=views.logout_request, name="logout"),
      path("register", view=views.registration, name="register"),

>>>>>>> 9d212ab1a9df09086142939d57aa7bb4d23384a8

    # path for dealer reviews view

    # path for add a review view

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
