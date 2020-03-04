var db = require('knex')({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    }
});

exports.insertTweets = (tweets) => {
    console.log('- Inserting tweets to DB -');
    const tweetsRows = tweets.map(tweet => {return { text: tweet.text, tweet_id_str: tweet.tweetIdStr, username: tweet.username}}).reverse();
    return db('tweets').insert(tweetsRows)
    .catch(err => {
        console.log('Failed inserting tweets to DB.', err);
        throw err;
    });
}

exports.getLastTweetIdStr = () => {
    return db.select('tweet_id_str').from('tweets').orderBy('id', 'desc').limit(1).then((data) => data[0].tweet_id_str);
}