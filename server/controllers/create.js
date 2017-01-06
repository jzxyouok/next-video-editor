const logger = require('@financial-times/n-logger').default;
const denodeify = require('denodeify');
const uuid = require('node-uuid');

const mongoClient = require('../clients/mongo');

module.exports = {
	view: (req, res) => {
		res.render('form', {
			layout: 'layout'
		});
	},
	action: (req, res) => {
		mongoClient.then(db => {
			const collection = db.collection('documents');
			const id = uuid.v4();
			const { title, standfirst } = req.body;
			const video = {
				id,
				title,
				standfirst
			};
			return denodeify(collection.insert.bind(collection))(video);
		})
			.then(result => {
				const { ops: [{ id }] } = result;
				res.redirect(`/${id}/update`);
			})
			.catch(err => {
				logger.error(err);
				res.sendStatus(500);
			})
	}
};
