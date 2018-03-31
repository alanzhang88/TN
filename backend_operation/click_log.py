import sys
import os
import json
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'utility'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'config'))

import config
from CloudAMQPClient import CloudAMQPClient
import MongodbClient
AMQP_URL_CLICK = config.AMQP_URL_CLICK
queueName = config.CLICK_QUEUE_NAME
AMQPClient = CloudAMQPClient(connectionURL=AMQP_URL_CLICK,queueName=queueName)
USER_COLLECTION_NAME = config.USER_COLLECTION_NAME

collection = MongodbClient.get_collection(USER_COLLECTION_NAME)
NUM_OF_CLASSES = 17
INITIAL_P = 1.0 / NUM_OF_CLASSES
ALPHA = 0.1

def handle_msg(channel,method,properties,body):
    if method is not None:
        channel.basic_ack(method.delivery_tag)
        msg = json.loads(body)
        print(msg['user_id'])
        print(msg['news_label'])
        res = collection.find_one({
            'user_id': msg['user_id']
        })
        print(res)
        if 'preference' not in res.keys():
            res['preference'] = [ INITIAL_P for i in range(NUM_OF_CLASSES)]

        #Modify prob
        news_index = msg['news_label'] - 1
        for i in range(NUM_OF_CLASSES):
            if i == news_index:
                res['preference'][i] = (1-ALPHA)*res['preference'][i] + ALPHA
            else:
                res['preference'][i] = (1-ALPHA)*res['preference'][i]
        collection.replace_one({'user_id':msg['user_id']},res)

    else:
        print("No Message received")
        return None


while True:
    AMQPClient.consumeMessage(handle_msg)
