from werkzeug.wrappers import Request, Response
from werkzeug.serving import run_simple

from jsonrpc import JSONRPCResponseManager, dispatcher
from text_CNN import newsClassifier

filePath='labeled_news.csv'
t = newsClassifier(filePath=filePath)

@dispatcher.add_method
def classify(str):
    return t.classify(str)

@Request.application
def application(request):

    response = JSONRPCResponseManager.handle(
        request.data,dispatcher
    )
    return Response(response.json,mimetype='application/json')


if __name__ == '__main__':
    run_simple('localhost',4040,application)
