const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({ node: 'http://localhost:9200' });

const indexName = 'tweets';

exports.deleteAllTweets = async () => {
    console.log('Deleting tweets');
    await esClient.deleteByQuery({
        index: indexName,              // For deleting all indices use '_all'
        body: {
            query: {
                match_all: {}
            }
        }
    });
}

exports.insertTweets = async (tweets) => {
    if (tweets < 1) {
        return;
    }
    console.log('Inserting tweets to ES');
    const body = tweets.flatMap(tweet => [{ index: { _index: indexName } }, tweet]);
    console.log('Bulk insertion');
    const { body: bulkResponse } = await esClient.bulk({ refresh: true, body });
    console.log('Insertion to ES completed. Counting...');
    const { body: count } = await esClient.count({ index: indexName });
    console.log('Tweets count in ES:', count.count);
}

exports.searchTweets = async (words) => {
    console.log('Searching for a tweet');
    const { body } = await esClient.search({
        index: indexName,
        body: {
            query: {
                match: {
                    text: {
                        query: words,
                        operator: "or"
                    }

                }
            }
        }
    });

    console.log(body.hits.hits);
}

exports.printRecentTweets = async (limit) => {
    const { body } = await esClient.search({
        index: indexName,
        size: limit,
        body: {
            query: {
                match_all: { boost: 1.2 }
                }
            }
        }
    );

    console.log(body.hits.hits);
}


//
// Example of ES operations
//
// async function runEsExample() {
//     // Deleting all indices from ES
//     await esClient.deleteByQuery({
//         index: '_all',
//         body: {
//             query: {
//                 match_all: {}
//             }
//         }
//     })
//     // Let's start by indexing some data
//     await esClient.index({
//         index: 'game-of-thrones',
//         body: {
//             character: 'Ned Stark The 2nd',
//             quote: 'Winter is coming.'
//         }
//     })

//     await esClient.index({
//         index: 'game-of-thrones',
//         body: {
//             character: 'Daenerys Targaryen',
//             quote: 'I am the blood of the dragon.',
//             age: 55
//         }
//     })

//     await esClient.index({
//         index: 'game-of-thrones',
//         // here we are forcing an index refresh,
//         // otherwise we will not get any result
//         // in the consequent search.
//         // NOT neccessery for regular flow (where search is not immediate)
//         refresh: true,
//         body: {
//             character: 'Tyrion Lannister',
//             quote: 'A mind needs books like a sword needs a whetstone.'
//         }
//     })

//     // Let's search!
//     const { body } = await esClient.search({
//         index: 'game-of-thrones',
//         body: {
//             query: {
//                 match: {
//                     quote: {
//                         query: 'books needs',
//                         operator: "and"
//                     }

//                 }
//             }
//         }
//     });
//     console.log(body.hits.hits);
// }

// runEsExample().catch(err => {
//     console.log(err)
// });