require('dotenv').config();
var cors = require('cors')
const express = require('express');
const tweetsCatcher = require('./tweets-catcher/tweets-catcher');
const esTweets = require('./elastic-search/esTweets-manager');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Getting root... Yam yam yam!');
});

app.get('/tweets', (req, res) => {
    console.log('Request was made with: ', req.query);

    const { search } = req.query;

    if (search === undefined) {
        res.status(400).json('Search term is missing');
        return;
    }
    
    esTweets.searchTweets(search, 100)
    .then(tweets => {
        if (tweets.length > 0) {
            console.log('Returning tweets count:', tweets.length);
            res.status(200).json(tweets);
        }
        else {
            res.status(404).json('No matching tweets for the search term');
        }
    })
    .catch(err => {
        console.log(err);
        res.status(400).json('Error while searching on the server');
    });
});

/////////////////////////////////
// --- STARTING THE SERVER --- //
/////////////////////////////////

console.log('-- Starting the server...');
tweetsCatcher.start();

app.listen(process.env.PORT || 3001, () => {
    console.log('-- Server is running on port 3001 or ENV.PORT:', process.env.PORT);
});