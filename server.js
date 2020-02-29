require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const twitter = require('./twitter-manager');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Getting root... Yam yam yam!');
});

twitter.getTweets('#javascript AND -filter:replies AND -filter:retweets', 3, (err, data, response) => {
    console.log(data);
});

/////////////////////////////////
// --- STARTING THE SERVER --- //
/////////////////////////////////

app.listen(process.env.PORT || 3001, () => {
    console.log('Server is running on port 3001 or ENV.PORT:', process.env.PORT);
});