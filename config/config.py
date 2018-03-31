NEWS_API_KEY = 'b722ac550ddf48c9a2e3a14995912284'

AMQP_URL_MONITOR_TO_SCRAPPER = 'amqp://sogtpowc:J9-3Mlzo8Hbr-dRzUOMQrIeS5F0AfaTU@donkey.rmq.cloudamqp.com/sogtpowc'
AMQP_URL_SCRAPPER_TO_DEDUPER = 'amqp://vxmqryfs:ZaLPHocKOABmPV94imWtai9RY6qq83mD@donkey.rmq.cloudamqp.com/vxmqryfs'
MONITOR_TO_SCRAPPER_QUEUE_NAME = 'scrapper-task'
SCRAPPER_TO_DEDUPER_QUEUE_NAME = 'deduper-task'

AMQP_URL_CLICK = 'amqp://hgmuyhcq:1-fAstTNTz-KCAY4PZLezksFqS-i_wqI@otter.rmq.cloudamqp.com/hgmuyhcq'
CLICK_QUEUE_NAME = 'click-task'

NEWS_TIME_OUT_IN_SECONDS = 3600 * 24
NEWS_COLLECTION_NAME = 'news'
NEWS_SIM_THRESHOLD = 0.3

USER_COLLECTION_NAME = 'users'
