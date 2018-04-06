from werkzeug.wrappers import Request, Response
from werkzeug.serving import run_simple
import sys
import os
import json
from jsonrpc import JSONRPCResponseManager, dispatcher
import redis
REDIS_HOST = 'localhost'
REDIS_PORT = 6379

from operator import itemgetter
import pickle
from bson.code import Code
from bson.objectid import ObjectId

redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT)

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'utility'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'config'))

import config
from CloudAMQPClient import CloudAMQPClient
from MongodbClient import get_collection
AMQP_URL_CLICK = config.AMQP_URL_CLICK
queueName = config.CLICK_QUEUE_NAME
AMQPClient = CloudAMQPClient(connectionURL=AMQP_URL_CLICK,queueName=queueName)
USER_COLLECTION_NAME = config.USER_COLLECTION_NAME
NEWS_COLLECTION_NAME = config.NEWS_COLLECTION_NAME

USER_COLLECTION = get_collection(USER_COLLECTION_NAME)
NEWS_COLLECTION = get_collection(NEWS_COLLECTION_NAME)

MAX_NEWS = 100
NEWS_PER_PAGE = 10
TIMEOUT_USER_IN_SECONDS = 2 * 60

SMOOTH_FACTOR = 0.1

@dispatcher.add_method
def clickLog(**kwargs):
    if 'user_id' in kwargs.keys() and 'news_label' in kwargs.keys():
        print(kwargs['user_id'])
        print(kwargs['news_label'])
        AMQPClient.sendMessage(msg=json.dumps(kwargs))
    return None

@dispatcher.add_method
def getNews(**kwargs):
    page_num = 1
    if 'page_num' in kwargs.keys():
        page_num = kwargs['page_num']
    start = (page_num - 1) * NEWS_PER_PAGE
    end = page_num * NEWS_PER_PAGE

    if 'user_id' not in kwargs.keys():
        news_list = list(NEWS_COLLECTION.find({},limit=MAX_NEWS,sort=[('publishedAt',-1)]))
        news_list = news_list[start:end]
        for news in news_list:
            del news['_id']
            del news['text']
            news['publishedAt'] = news['publishedAt'].isoformat()
        return news_list

    digest_list = []
    if redis_client.get(kwargs['user_id']) is None:
        user = USER_COLLECTION.find_one({'_id': ObjectId(kwargs['user_id'])})
        if user is None:
            return None
        news_list = list(NEWS_COLLECTION.find({},limit=MAX_NEWS,sort=[('publishedAt',-1)]))
        # print(news_list[0]['publishedAt'].timestamp())
        if 'preference' in user.keys() and len(user['preference'])>0:
            time_diff = news_list[0]['publishedAt'].timestamp() - news_list[-1]['publishedAt'].timestamp()
            smooth_portion = SMOOTH_FACTOR * time_diff
            min_time = news_list[-1]['publishedAt'].timestamp()
            for news in news_list:
                digest_list.append((news['digest'],((news['publishedAt'].timestamp()-min_time+smooth_portion)/(time_diff+smooth_portion))*user['preference'][news['class']-1]))
                # digest_list.append((news['digest'],news['publishedAt'].timestamp()*user['preference'][news['class']-1]))
            digest_list = sorted(digest_list,key=itemgetter(1),reverse=True)
            digest_list = [i[0] for i in digest_list]
        else:
            for news in news_list:
                digest_list.append(news['digest'])
        redis_client.set(kwargs['user_id'],pickle.dumps(digest_list),ex=TIMEOUT_USER_IN_SECONDS)
    else:
        digest_list = pickle.loads(redis_client.get(kwargs['user_id']))


    slice_index = digest_list[start:end]
    # print(slice_index)
    # news_slice_list = list(NEWS_COLLECTION.find({
    #     'digest': {'$in': slice_index}
    # }))

    #USE MapReduce to preserve order since by default it returns result in the ascending order of key
    map_reduce_res = NEWS_COLLECTION.map_reduce(
            map=Code("""
                function (){
                    var order = inputs.indexOf(this.digest);
                    emit(order,  this);
                }
            """),
            reduce=Code("""
                function (){}
            """),
            out={"inline":1},
            query={
                "digest":{"$in":slice_index}
            },
            scope={
                "inputs": slice_index
            }
            # finalize=Code("""
            #     function(key,value){
            #         return value.doc;
            #     }
            # """)

    )
    news_slice_list = [news['value'] for news in map_reduce_res['results']]

    # print(news_slice_list)
    for news in news_slice_list:
        del news['_id']
        del news['text']
        news['publishedAt'] = news['publishedAt'].isoformat()
    return news_slice_list

    # print(len(news_list))
    # for n in news_list:
    #     print(n['publishedAt'])

@Request.application
def application(request):

    response = JSONRPCResponseManager.handle(
        request.data,dispatcher
    )
    return Response(response.json,mimetype='application/json')


if __name__ == '__main__':
    run_simple('localhost',8080,application)
