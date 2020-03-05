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

    const body = tweets.flatMap(tweet => [{ index: { _index: indexName } }, tweet]);

    const { body: bulkResponse } = await esClient.bulk({ refresh: true, body });

    const { body: count } = await esClient.count({ index: indexName });

    console.log('Tweets count in ES after new insertion:', count.count);
}

exports.searchTweets = async (words, limit = 100) => {
    console.log('Searching for tweets');

    const { body } = await esClient.search({
        index: indexName,
        size: limit,
        sort: {tweetIdStr: 'desc'},
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

    return body.hits.hits.map(hit => {
        return {
            username: hit._source.username,
            text: hit._source.text
        }
    });
}

exports.printTweets = async (limit) => {
    const { body } = await esClient.search({
        index: indexName,
        size: limit,
        body: {
            query: {
                match_all: {}
                }
            }
        }
    );

    console.log(body.hits.hits);
}
