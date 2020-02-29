const express = require('express');
const fetch = require('node-fetch');

console.log('--- SERVER START ---');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Getting root... Yam yam yam!');
});

/////////////////////////////////
// --- STARTING THE SERVER --- //
/////////////////////////////////

app.listen(process.env.PORT || 3001, () => {
    console.log('Server is running on port 3001 or ENV.PORT:', process.env.PORT);
});