# Twitter API and ElasticSearch Example
Example of usage of Twitter API and ElasticSearch.
Back-end: Node.js. Front-end: React.

Link to the front-end (client) project: https://github.com/etriv/SearchJS-client

## How to start the project
- Install PostgreSQL and ElasticSearch
- Run in both **client** and **server** projects:
  ``` bash
  npm install
  ```
- Create a Postgres database using the CREATE queries supplied in the path: database/create-queries.txt.
- Configure these environment variables in the **server** project (inside a .env file in the root folder):
  ``` bash
  DB_HOST=
  DB_USER=
  DB_PASS=
  DB_NAME=twitter-db

  TWITTER_CONSUMER_KEY=
  TWITTER_CONSUMER_SECRET=
  TWITTER_ACCESS_TOKEN=
  TWITTER_ACCESS_TOKEN_SECRET=
  ```
- Run in both **client** and **server** projects:
  ``` bash
  npm start
  ```

## Design Decisions
In order to make the most recent tweets searchable (quickly via ElasticSearch), I realised that the main flow of the app will be:
1. Get the most recent relevant tweets from Twitter's API.
2. Insert the tweets into the database.
3. Insert the tweets into ElasticSearch.

And those 3 stages will repeat every few seconds - fetching new tweets from Twitter to keep the data stores up-to-date.

In addition to that, search queries by the client will only trigger a search in the ElasticSearch's store.

For ease of development and maintenance, the project has 4 main modules:
1. dbTweets-manager - responsible for querying the database regarding tweets.
2. esTweets-manager - responsible for indexing and searching tweets in ElasticSearch.
3. twitter-manager - responsible for making api calls to twitter.
4. tweets-catcher - responsible for executing the main flow described before, while integrating the three previous modules.
