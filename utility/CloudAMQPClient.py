import pika
import json

class CloudAMQPClient:
    def __init__(self,connectionURL,queueName):
        self.connectionURL = connectionURL
        self.queueName = queueName
        self.params = pika.connection.URLParameters(self.connectionURL)
        self.params.socket_timeout = 3
        self.connection = pika.BlockingConnection(self.params)
        self.channel = self.connection.channel()
        self.channel.queue_declare(self.queueName)

    def sendMessage(self,msg):
        self.channel.basic_publish(exchange='',
                                   routing_key=self.queueName,
                                   body=msg)
        # print(" [X] Sent Message %s to %s" % (msg, self.queueName))

    def getMessage(self):
        method, properties, body = self.channel.basic_get(queue=self.queueName)
        if method is not None:
            # print(" [O] Receive Message %s from %s" % (body,self.queueName))
            self.channel.basic_ack(method.delivery_tag)
            return json.loads(body)
        else:
            print("No Message received")
            return None

    def consumeMessage(self,cb):
        self.channel.basic_consume(consumer_callback=cb,queue=self.queueName)
        self.channel.start_consuming()

    def sleep(self,duration):
        self.connection.sleep(duration)

    def __del__(self):
        self.connection.close()
