require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const twitter = require('./twitter-manager');
const { Client } = require('@elastic/elasticsearch')

const esClient = new Client({ node: 'http://localhost:9200' })

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Getting root... Yam yam yam!');
});

twitter.getTweets('#javascript AND -filter:replies AND -filter:retweets', 3, (err, data, response) => {
    // console.log('Example tweet:', data.statuses[0].full_text);
});

async function runEsExample() {
    await esClient.deleteByQuery({
        index: '_all',
        body: {
            query: {
              match_all: {}
            }
          }
      })
    // Let's start by indexing some data
    await esClient.index({
        index: 'game-of-thrones',
        body: {
            character: 'Ned Stark The 2nd',
            quote: 'Winter is coming.'
        }
    })

    await esClient.index({
        index: 'game-of-thrones',
        body: {
            character: 'Daenerys Targaryen',
            quote: 'I am the blood of the dragon.',
            age: 55
        }
    })

    await esClient.index({
        index: 'game-of-thrones',
        // here we are forcing an index refresh,
        // otherwise we will not get any result
        // in the consequent search.
        // NOT neccessery for regular flow (where search is not immediate)
        refresh: true,
        body: {
            character: 'Tyrion Lannister',
            quote: 'A mind needs books like a sword needs a whetstone.'
        }
    })

    // Let's search!
    const { body } = await esClient.search({
        index: 'game-of-thrones',
        body: {
            query: {
                match: {
                    quote: 'dragon'
                }
            }
        }
    })
    console.log(body.hits.hits)
}

runEsExample().catch(err => {
    console.log(err)
});

/////////////////////////////////
// --- STARTING THE SERVER --- //
/////////////////////////////////

app.listen(process.env.PORT || 3001, () => {
    console.log('--- Server is running on port 3001 or ENV.PORT:', process.env.PORT);
});