"""djangoproj URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView, TemplateView
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),

    path('djangoapp/', include('djangoapp.urls')),

    # The React build asks for these at the root; they live under /static/.
    path('manifest.json', RedirectView.as_view(
        url='/static/manifest.json', permanent=True)),
    path('favicon.ico', RedirectView.as_view(
        url='/static/favicon.ico', permanent=True)),

    path('', TemplateView.as_view(
        template_name="index.html")),

    path('about/', TemplateView.as_view(
        template_name="index.html")),

    # The old contact page is gone; About links to the source and issues.
    path('contact/', RedirectView.as_view(
        url='/about/', permanent=True)),

    path('login/', TemplateView.as_view(
        template_name="index.html")),
    path('logout/', TemplateView.as_view(
        template_name="index.html")),

    path('register/', TemplateView.as_view(
        template_name="index.html")),

    path('dealers/', TemplateView.as_view(
        template_name="index.html")),

    path('dealer/<int:dealer_id>', TemplateView.as_view(
        template_name="index.html")),

    path('postreview/<int:dealer_id>', TemplateView.as_view(
        template_name="index.html")),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
