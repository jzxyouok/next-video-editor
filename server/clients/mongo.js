const denodeify = require('denodeify');
const MongoClient = require('mongodb').MongoClient;

const mongoClient = denodeify(MongoClient.connect)('mongodb://localhost:27017/next-video-editor');

module.exports = mongoClient;
