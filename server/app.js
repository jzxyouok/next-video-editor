const express = require('@financial-times/n-express');
const bodyParser = require('body-parser');
const path = require('path');

const mongoClient = require('./clients/mongo');
const controllers = require('./controllers/index');

const app = express({
	hasNUiBundle: false,
	layoutsDir: path.join(process.cwd(), 'views'),
	systemCode: 'next-video-editor',
	withHandlebars: true
});
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.get('/__gtg', controllers.gtg);

app.get('/', controllers.list);
app.get('/create', controllers.create.view);
app.post('/create', urlencodedParser, controllers.create.action);
app.get('/:id', controllers.read);
app.get('/:id/update', controllers.update.view);
app.post('/:id/update/', urlencodedParser, controllers.update.action);

// wait until we're connected to mongo
const listen = mongoClient.then(() => app.listen(process.env.PORT || 3001));

module.exports = {
	listen
};
