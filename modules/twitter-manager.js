const Twit = require('twit');

// Config twitter API access
var twitterApi = new Twit({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token: process.env.TWITTER_ACCESS_TOKEN,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    timeout_ms: 60 * 1000,  // optional
    strictSSL: true,        // optional
})

exports.getTweets = (query, count, sinceId = '0') => {
    return new Promise(resolve => {
        twitterApi.get('search/tweets', {
            q: query,
            tweet_mode: 'extended',
            lang: 'en',
            result_type: 'recent',
            count: count,
            since_id: sinceId
        }, (err, data, response) => {
            const leanTweets = data.statuses.map(tweet => {return { text: tweet.full_text, tweetIdStr: tweet.id_str, username: tweet.user.name}});
            resolve(leanTweets);
        });
    });
}

// TODO: Write a proccess that will run every 6 seconds, getting new tweets (since last id_str), updating DB, and then ES.
// First find last id_str in DB (if not found, start from 0)
// The Drinker