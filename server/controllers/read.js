const logger = require('@financial-times/n-logger').default;
const denodeify = require('denodeify');

const mongoClient = require('../clients/mongo');

module.exports = (req, res) => {
	mongoClient.then(db => {
		const collection = db.collection('documents');
		return denodeify(collection.findOne.bind(collection))({ id: req.params.id });
	})
		.then(video => {
			res.json(video);
		})
		.catch(err => {
			logger.error(err);
			res.sendStatus(500);
		})
};
