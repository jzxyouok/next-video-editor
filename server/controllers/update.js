const logger = require('@financial-times/n-logger').default;
const denodeify = require('denodeify');

const mongoClient = require('../clients/mongo');

module.exports = {
	view: (req, res) => {
		mongoClient.then(db => {
			const collection = db.collection('documents');
			return denodeify(collection.findOne.bind(collection))({ id: req.params.id });
		})
			.then(result => {
				res.render('update', {
				layout: 'layout',
					video: result
				});
			})
			.catch(err => {
				logger.error(err);
				res.sendStatus(500);
			});
	},
	action: (req, res) => {
		mongoClient.then(db => {
			const collection = db.collection('documents');
			const id = req.params.id;
			if (req.body.action.toLowerCase() === 'update') {
				const { title, standfirst } = req.body;
				const video = { title, standfirst };
				return denodeify(collection.updateOne.bind(collection))({ id }, { $set: video })
					.then(() => {
						res.redirect(`/update/${id}`);
					});
			} else {
				return denodeify(collection.deleteOne.bind(collection))({ id })
					.then(() => {
						res.redirect('/');
					});
			}
		})
			.catch(err => {
				logger.error(err);
				res.sendStatus(500);
			})
	}
};
