import sys
import os
import pika
import json
import nltk
from dup_checker import check_dup
from dateutil import parser
from datetime import datetime,timedelta

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'utility'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'config'))

from CloudAMQPClient import CloudAMQPClient
import config
import MongodbClient
from rpcClient import rpcClient

CLOUDAMQPURL = config.AMQP_URL_MONITOR_TO_SCRAPPER
CLOUDAMQPQUEUE = config.MONITOR_TO_SCRAPPER_QUEUE_NAME
NEWS_COLLECTION_NAME = config.NEWS_COLLECTION_NAME

cloudamqp_client = CloudAMQPClient(CLOUDAMQPURL,CLOUDAMQPQUEUE)
collection = MongodbClient.get_collection(NEWS_COLLECTION_NAME)
rpc = rpcClient('http://localhost:4040')

try:
     nltk.data.find("corpora/stopwords")
except LookupError:
    print("stopwords not found on the machine, download it now")
    nltk.download("stopwords")

def check_possible_dup_docs(doc,dt):
    start = dt - timedelta(hours=12)
    end = dt + timedelta(hours=12)
    news_list = collection.find({'publishedAt':{'$gte':start,'$lt':end}})
    for news in news_list:
        if check_dup(doc,[news['text']]):
            return True
    return False

def handle_msg(channel,method,properties,body):
    if method is not None:
        channel.basic_ack(method.delivery_tag)
        news = json.loads(body)
        print(" [O] Receive News with title %s" % news['title'])
        news['publishedAt'] = parser.parse(news['publishedAt']) if news['publishedAt'] is not None else datetime(2018,1,1).utcnow()
        if check_possible_dup_docs(news['text'],news['publishedAt']):
            print("Document with title %s is duplicate" % news['title'])
        else:
            # TODO: Add classification from TensorFlow
            payload = {
            "method": "classify",
            "params": [news['title']+' '+news['description']+' '+news['source']],
            "id": 0,
            "jsonrpc": "2.0"
            }
            resp = rpc.send_request(payload=payload)
            if resp is not None:
                news['class'] = resp
                print("Document with title %s is new" % news['title'])
                collection.insert_one(news)

    else:
        print("No Message received")
        return None


while True:
    cloudamqp_client.consumeMessage(handle_msg)
