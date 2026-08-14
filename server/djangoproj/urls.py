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

    # Login and other Django app URLs
    path('', include('djangoapp.urls')),
    path('login/', TemplateView.as_view(template_name="index.html")),
    path('', TemplateView.as_view(template_name='Home.html')),
    path('about/', TemplateView.as_view(template_name='About.html')),
    path('contact/', TemplateView.as_view(template_name='Contact.html')),
]

urlpatterns += static(
    settings.STATIC_URL,
    document_root=settings.STATIC_ROOT
)