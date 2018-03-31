from text_CNN import newsClassifier

filePath='labeled_news.csv'
t = newsClassifier(filePath=filePath)
t.train()
