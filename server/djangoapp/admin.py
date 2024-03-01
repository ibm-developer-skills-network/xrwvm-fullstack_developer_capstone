from django.contrib import admin
from .models import CarMake, CarModel


# Register your models here.

# Registering models with thier respective admins
admin.site.register(CarMake)
admin.site.register(CarModel)

# CarModelInline class

# CarModelAdmin class

# CarMakeAdmin class with CarModelInline

# Register models here
