from django.urls import path
from django.conf.urls.static import static
from django.conf import settings
from . import views

app_name = 'djangoapp'
urlpatterns = [
    # # path for about view

    # # path for contact us view

    # # path for registration

    # path for login
    # path(route='login', view=views.login_user, name='login'),

    # #path to landing page and home
    # path(route='', view=views.home, name='home'),

    # path for dealer reviews view

    # path for add a review view

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
