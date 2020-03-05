const twitter = require('./twitter-manager');
const esTweets = require('./esTweets-manager');
const dbTwitter = require('./dbTweets-manager');

exports.start = async () => {
    const twitterQuery = '#javascript AND -filter:replies AND -filter:retweets';
    const maxTweets = 100;
    const refreshTime = 6;  // In seconds

    let iteration = 1;
    // await esTweets.deleteAllTweets();
    
    (async function catcher() {
        console.log('--- Iteration ' + iteration++ + ' ---');
        let lastTwitterIdStr = await dbTwitter.getLastTweetIdStr();
        console.log('Last inserted idStr:', lastTwitterIdStr);

        tweets = await twitter.getTweets(twitterQuery, maxTweets, lastTwitterIdStr);
        console.log('Tweets found:', tweets.length);
        
        await dbTwitter.insertTweets(tweets);
        await esTweets.insertTweets(tweets);

        setTimeout(catcher, refreshTime * 1000);
      })();
}