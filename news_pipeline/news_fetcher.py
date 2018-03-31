import sys
import os
import json
from newspaper import Article
from hashlib import blake2b
import redis

sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'utility'))
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'config'))

from CloudAMQPClient import CloudAMQPClient
from newsAPIClient import newsAPIClient
import config

NEWS_API_KEY = config.NEWS_API_KEY
CLOUDAMQPURL = config.AMQP_URL_MONITOR_TO_SCRAPPER
CLOUDAMQPQUEUE = config.MONITOR_TO_SCRAPPER_QUEUE_NAME
NEWS_TIME_OUT_IN_SECONDS = config.NEWS_TIME_OUT_IN_SECONDS

REDIS_HOST = 'localhost'
REDIS_PORT = 6379

NEWS_SOURCES = [
    'bbc-news',
    'bbc-sport',
    'bloomberg',
    'cnn',
    'entertainment-weekly',
    'espn',
    'ign',
    'techcrunch',
    'the-new-york-times',
    'the-wall-street-journal',
    'the-washington-post'
]

def hash_title(title):
    byteObj = bytes(title,encoding='utf-8')
    digest = blake2b(byteObj).hexdigest()
    return digest

news_client = newsAPIClient(apiKey=NEWS_API_KEY,src_list=NEWS_SOURCES)

cloudamqp_client = CloudAMQPClient(CLOUDAMQPURL,CLOUDAMQPQUEUE)

redis_client = redis.StrictRedis(REDIS_HOST, REDIS_PORT)

while True:
    headlines = news_client.getHeadlines()
    num_of_new_news = 0
    if headlines is not None:
        for headline in headlines:
            digest = hash_title(headline['title'])
            if redis_client.get(digest) is None:
                num_of_new_news += 1
                headline['digest'] = digest
                headline['source'] = headline['source']['name']
                article = Article(headline['url'])
                article.download()
                article.parse()
                if len(article.text) >= len(headline['description']):
                    headline['text'] = article.text
                else:
                    headline['text'] = headline['description']
                cloudamqp_client.sendMessage(json.dumps(headline))
                print(" [X] Sent News with title %s" % headline['title'])
                redis_client.set(digest, headline)
                redis_client.expire(digest, NEWS_TIME_OUT_IN_SECONDS)
    print("Fecthed %d new news" % num_of_new_news)
    cloudamqp_client.sleep(120)
