from pymongo import MongoClient

MONGO_DB_HOST = "localhost"
MONGO_DB_PORT = "27017"
DB_NAME = "TN"

client = MongoClient(MONGO_DB_HOST,int(MONGO_DB_PORT))
db = client[DB_NAME]

def get_collection(collection_name):
    return db[collection_name]
