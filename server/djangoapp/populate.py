import json
from pathlib import Path

from djangoproj.settings import BASE_DIR

from .models import CarMake, CarModel


def initiate():
    data_path = Path(BASE_DIR) / 'database' / 'data' / 'car_records.json'
    with open(data_path, encoding='utf-8') as data_file:
        cars = json.load(data_file)['cars']

    seen = set()
    for car in cars:
        car_make, _ = CarMake.objects.get_or_create(
            name=car['make'],
            defaults={'description': f'{car["make"]} vehicles'},
        )
        key = (car_make.pk, car['model'], car['bodyType'], car['year'])
        if key in seen:
            continue
        seen.add(key)
        CarModel.objects.get_or_create(
            car_make=car_make,
            name=car['model'],
            type=car['bodyType'],
            year=car['year'],
        )
