const logger = require('@financial-times/n-logger').default;
const denodeify = require('denodeify');
const uuid = require('node-uuid');

const mongoClient = require('../clients/mongo');
const tagsToMetadata = require('../lib/tags-to-metadata');

module.exports = {
	view: (req, res) => {
		res.render('form', {
			layout: 'layout'
		});
	},
	action: (req, res) => {
		mongoClient.then(db => {
			const id = uuid.v4();
			const { title, standfirst, tags } = req.body;
			return tagsToMetadata(tags)
				.then(metadata => {
					const collection = db.collection('documents');
					const video = { id, title, standfirst, metadata };
					return denodeify(collection.insert.bind(collection))(video);
				})
				.then(() => {
					res.redirect(`/${id}/update`);
				});
		})
			.catch(err => {
				logger.error(err);
				res.sendStatus(500);
			})
	}
};
