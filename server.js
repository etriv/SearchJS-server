const express = require('express');
const fetch = require('node-fetch');
const Twit = require('twit');
require('dotenv').config();

var T = new Twit({
    consumer_key: process.env.CONSUMER_KEY,
    consumer_secret: process.env.CONSUMER_SECRET,
    access_token: process.env.ACCESS_TOKEN,
    access_token_secret: process.env.ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000,  // optional
    strictSSL: true,        // optional
})

console.log('--- SERVER START ---');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Getting root... Yam yam yam!');
});

T.get('search/tweets', {
    q: '#javascript AND -filter:replies AND -filter:retweets',
    tweet_mode: 'extended',
    lang: 'en',
    result_type: 'recent',
    count: 2
},
    function (err, data, response) {
        console.log(data)
    }
)

/////////////////////////////////
// --- STARTING THE SERVER --- //
/////////////////////////////////

app.listen(process.env.PORT || 3001, () => {
    console.log('Server is running on port 3001 or ENV.PORT:', process.env.PORT);
});