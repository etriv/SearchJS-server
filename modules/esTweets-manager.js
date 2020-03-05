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
