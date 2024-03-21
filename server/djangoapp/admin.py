from django.contrib import admin
from .models import CarMake, CarModel


# Register your models here.

# Registering models with thier respective admins
class CarModelInline(admin.StackedInline):
    model = CarModel
    extra = 5

class CarMakeAdmin(admin.ModelAdmin):
    fields =['name', 'description']
    inlines = [CarModelInline]


class CarModelAdmin(admin.ModelAdmin):
    fields = ['name', 'type', 'year', 'car_make']

admin.site.register(CarMake, CarMakeAdmin)
admin.site.register(CarModel, CarModelAdmin)



# Register models here
