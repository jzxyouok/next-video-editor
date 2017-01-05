const denodeify = require('denodeify');
const MongoClient = require('mongodb').MongoClient;

const mongodbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/next-video-editor'
const mongoClient = denodeify(MongoClient.connect)(mongodbUri);

module.exports = mongoClient;
