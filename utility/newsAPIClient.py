import requests
import time

DEFAULT_LIST = ["bbc-news"]

END_POINT = 'https://newsapi.org/v2/top-headlines'

class newsAPIClient:
    def __init__(self, apiKey,src_list=DEFAULT_LIST,end_point=END_POINT):
        self.src_list = src_list
        self.end_point = end_point
        self.apiKey = apiKey
        self.url = end_point + '?' + 'sources=' + ','.join(self.src_list) + '&apiKey=' + self.apiKey + '&pageSize=100'

    def getHeadlines(self):
        response = requests.get(self.url)
        # print(response.json())
        r = response.json()
        print("response status: %s; Found %d results" % (r['status'],r['totalResults']))
        if r['status'] == 'ok' and r['totalResults'] > 0:
            return r['articles']
        else:
            return None

    def sleep(self,duration):
        time.sleep(duration)
