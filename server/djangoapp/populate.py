from .models import CarMake, CarModel

def initiate():
    car_make_data = [
        {"name": "NISSAN", "description": "Great cars. Japanese technology"},
        {"name": "Mercedes", "description": "Great cars. German technology"},
        {"name": "Audi", "description": "Great cars. German technology"},
        {"name": "Kia", "description": "Great cars. Korean technology"},
        {"name": "Toyota", "description": "Great cars. Japanese technology"},
    ]

    car_make_instances = []
    for data in car_make_data:
        car_make_instances.append(CarMake.objects.create(name=data['name'], description=data['description']))

    # Create CarModel instances with the corresponding CarMake instances
    car_model_data = [
        {"name": "Pathfinder", "type": "SUV", "year": 2023, "car_make_id": car_make_instances[0].id},
        {"name": "Qashqai", "type": "SUV", "year": 2023, "car_make_id": car_make_instances[0].id},
        {"name": "XTRAIL", "type": "SUV", "year": 2023, "car_make_id": car_make_instances[0].id},
        {"name": "A-Class", "type": "SUV", "year": 2023, "car_make_id": car_make_instances[1].id},
        {"name": "C-Class", "type": "SUV", "year": 2023, "car_make_id": car_make_instances[1].id},
        {"name": "E-Class", "type": "SUV", "year": 2023, "car_make_id": car_make_instances[1].id},
        {"name": "A4", "type": "SUV", "year": 2023, "car_make_id": car_make_instances[2].id},
        {"name": "A5", "type": "SUV", "year": 2023, "car_make_id": car_make_instances[2].id},
        {"name": "A6", "type": "SUV", "year": 2023, "car_make_id": car_make_instances[2].id},
        {"name": "Sorrento", "type": "SUV", "year": 2023, "car_make_id": car_make_instances[3].id},
        {"name": "Carnival", "type": "SUV", "year": 2023, "car_make_id": car_make_instances[3].id},
        {"name": "Cerato", "type": "Sedan", "year": 2023, "car_make_id": car_make_instances[3].id},
        {"name": "Corolla", "type": "Sedan", "year": 2023, "car_make_id": car_make_instances[4].id},
        {"name": "Camry", "type": "Sedan", "year": 2023, "car_make_id": car_make_instances[4].id},
        {"name": "Kluger", "type": "SUV", "year": 2023, "car_make_id": car_make_instances[4].id},
        # Add more CarModel instances as needed
    ]

    for data in car_model_data:
        CarModel.objects.create(
            name=data['name'],
            car_make_id=data['car_make_id'],
            type=data['type'],
            year=data['year']
        )
