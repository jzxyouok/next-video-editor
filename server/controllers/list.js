const logger = require('@financial-times/n-logger').default;
const denodeify = require('denodeify');

const mongoClient = require('../clients/mongo');

module.exports = (req, res) => {
	mongoClient.then(db => {
		const find = db.collection('documents').find({ });
		return denodeify(find.toArray.bind(find))();
	})
		.then(videos => {
			res.render('list', {
				layout: 'layout',
				videos
			});
		})
		.catch(err => {
			logger.error(err);
			res.sendStatus(500);
		})
};
