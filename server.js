require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const twitter = require('./modules/twitter-manager');
const esTweets = require('./modules/esTweets-manager');
const dbTwitter = require('./modules/dbTweets-manager');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Getting root... Yam yam yam!');
});

let twitterQuery = '#javascript AND -filter:replies AND -filter:retweets';
twitter.getTweets(twitterQuery, 5, '0', (tweets) => {
    console.log('Tweets found', tweets.length);

    dbTwitter.insertTweets(tweets).then(() => {
        dbTwitter.getLastTweetIdStr().then((data) => console.log(data));
    });

    // esTweets.deleteAllTweets()
    // .then(() => esTweets.insertTweets(tweets))
    // .then(() => esTweets.searchTweets('code'))
    // .then(() => esTweets.printAllTweets());
});





/////////////////////////////////
// --- STARTING THE SERVER --- //
/////////////////////////////////

console.log('Starting the server...');
app.listen(process.env.PORT || 3001, () => {
    console.log('--- Server is running on port 3001 or ENV.PORT:', process.env.PORT);
});