# TapNews Project
The project uses python to create a news pipeline by first scraping news from the internet, do a duplication detection using TF-IDF, and then a classifcation of the news using Convolutional Neural Network. Create a recommendation system by considering the click history of the user and the time of the news published. Then, it uses React as front end and Express as back end to create a single page web app to display the news to the user.

## News Pipeline
- Write a scraper to keep fetching news by getting headlines from news API and then using newspaper python library to download the news.
- Hash the news content and store the hash in redis to eliminate some duplicates
- Using TF-IDF to eliminate duplicates further
- Build a CNN using tensorflow to do news classification into different categories
- Store the classified news in MongoDB for further uses.
- Create a news recommendation system by applying click history on time decay model. Also take consideration of the time when the news published so the score of a piece of news probility from time decay model mulitply to the time of the news. We return the news in descending order of the score.
- Break down the above into different components where each component communicate with the other using RabbitMQ. 
- Create a python RPC server so that the web server can retrieve classified news through RPC calls, and send the latest click log to update the recommendation system.

## Web Server
- Using React to create a single page web app for the front end. 
- Using PassportJs so that user can login through google account
- Using Express to create back end and create REST API for the front end to retrieve news and send out the click log to python back end
- Using JsonWebToken to create session cookie
