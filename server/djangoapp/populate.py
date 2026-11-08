from .models import CarMake, CarModel

CAR_MAKES = [
    {"name": "NISSAN", "description": "Great cars. Japanese technology"},
    {"name": "Mercedes", "description": "Great cars. German technology"},
    {"name": "Audi", "description": "Great cars. German technology"},
    {"name": "Kia", "description": "Great cars. Korean technology"},
    {"name": "Toyota", "description": "Great cars. Japanese technology"},
]

# (model name, body type, index into CAR_MAKES)
CAR_MODELS = [
    ("Pathfinder", "SUV", 0),
    ("Qashqai", "SUV", 0),
    ("XTRAIL", "SUV", 0),
    ("A-Class", "SUV", 1),
    ("C-Class", "SUV", 1),
    ("E-Class", "SUV", 1),
    ("A4", "SUV", 2),
    ("A5", "SUV", 2),
    ("A6", "SUV", 2),
    ("Sorrento", "SUV", 3),
    ("Carnival", "SUV", 3),
    ("Cerato", "Sedan", 3),
    ("Corolla", "Sedan", 4),
    ("Camry", "Sedan", 4),
    ("Kluger", "SUV", 4),
]


def initiate():
    makes = []
    for data in CAR_MAKES:
        makes.append(CarMake.objects.create(
            name=data["name"], description=data["description"]))

    for name, car_type, make_index in CAR_MODELS:
        CarModel.objects.create(
            name=name,
            car_make=makes[make_index],
            type=car_type,
            year=2023)
