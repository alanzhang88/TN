import requests
import json

class rpcClient:

    def __init__(self,url):
        self.url = url
        self.headers = {'content-type':'application/json'}

    def send_request(self,payload):
        response = requests.post(self.url,data=json.dumps(payload),headers=self.headers).json()
        if 'result' in response.keys():
            return response['result']
        else:
            print("Error in RPC call")
            print(response['error'])
            return None


if __name__ == '__main__':
    t = rpcClient('http://localhost:4040')
    r = t.send_request({
        "method": "classify",
        "params": ["Why the Nunes memo really isn't a partisan fight Because we are so polarized politically these days, there's a tendency to assume that every single issue that breaches our collective national consciousness must, at its root, be a fight between Democrats and Republicans. CNN"],
        "id": 0,
        "jsonrpc": "2.0"
        })
    print(r)
