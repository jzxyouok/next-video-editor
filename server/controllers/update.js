const logger = require('@financial-times/n-logger').default;
const denodeify = require('denodeify');
const querystring = require('querystring');

const mongoClient = require('../clients/mongo');

const tagsToMetadata = tags => {
	const getThings = [].concat(tags)
		.map(tag => {
			const qs = querystring.stringify({
				identifierValue: tag,
				authority: 'http://api.ft.com/system/FT-TME',
				apiKey: process.env.ES_INTERFACE_API_KEY
			});
			return fetch(`https://ft-next-es-interface-eu.herokuapp.com/things?${qs}`)
				.then(response => response.json())
				.then(({ term }) => term);
		});
	return Promise.all(getThings);
};

module.exports = {
	view: (req, res) => {
		mongoClient.then(db => {
			const collection = db.collection('documents');
			return denodeify(collection.findOne.bind(collection))({ id: req.params.id });
		})
			.then(video => {
				res.render('form', {
				layout: 'layout',
					video
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
				const { title, standfirst, tags } = req.body;
				return tagsToMetadata(tags)
					.then(metadata => {
						const video = { title, standfirst, metadata };
						return denodeify(collection.updateOne.bind(collection))({ id }, { $set: video })
					})
					.then(() => {
						res.redirect(`/${id}/update`);
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
;
