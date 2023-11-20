import json
from pymongo import MongoClient

# MongoDB connection details
mongo_uri = "mongodb://root:password@localhost:27017/"

# Connect to MongoDB with authentication
client = MongoClient(mongo_uri)
database = client["dealershipsdb"]

collection = database["dealerships"]

# Load data from JSON file
json_file = "dealership.json"

with open(json_file, 'r') as file:
    data = json.load(file)

collection.insert_many(data)

collection = database["reviews]

# Load data from JSON file
json_file = "reviews.json"

with open(json_file, 'r') as file:
    data = json.load(file)

collection.insert_many(data)

# Close MongoDB connection
client.close()

print("Data loaded into MongoDB successfully")
