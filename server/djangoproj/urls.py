"""djangoproj URL Configuration
The `urlpatterns` list routes URLs to views.
"""

from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),

    path('djangoapp/', include('djangoapp.urls')),

    path('', TemplateView.as_view(template_name='Home.html')),
    path('about/', TemplateView.as_view(template_name='About.html')),
    path('contact/', TemplateView.as_view(template_name='Contact.html')),
    path('login/', views.login_user, name='login'),

] + static(
    settings.STATIC_URL,
    document_root=settings.STATIC_ROOT
)