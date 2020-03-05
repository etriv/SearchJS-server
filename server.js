require('dotenv').config();
const express = require('express');
const tweetsCatcher = require('./modules/tweets-catcher');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Getting root... Yam yam yam!');
});

tweetsCatcher.start();

/////////////////////////////////
// --- STARTING THE SERVER --- //
/////////////////////////////////

console.log('Starting the server...');
app.listen(process.env.PORT || 3001, () => {
    console.log('--- Server is running on port 3001 or ENV.PORT:', process.env.PORT);
});