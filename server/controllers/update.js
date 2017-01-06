const logger = require('@financial-times/n-logger').default;
const denodeify = require('denodeify');

const mongoClient = require('../clients/mongo');
const tagsToMetadata = require('../lib/tags-to-metadata');
const getVideoData = require('../lib/get-video-data');

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
				const { title, standfirst, tags, video: videoId } = req.body;
				return Promise.all([tagsToMetadata(tags), getVideoData(videoId)])
					.then(([metadata, videoData]) => {
						const video = Object.assign({ title, standfirst, metadata }, videoData);
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
