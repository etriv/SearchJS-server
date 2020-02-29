const Twit = require('twit');

var twitterApi = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000,  // optional
    strictSSL: true,        // optional
})

exports.getTweets = (query, count, callback) => {
    twitterApi.get('search/tweets', {
        q: query,
        tweet_mode: 'extended',
        lang: 'en',
        result_type: 'recent',
        count: count
    }, callback)
}
