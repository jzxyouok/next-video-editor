try {
const express = require('@financial-times/n-express');

const controllers = require('./controllers/index');

const app = express({
	systemCode: 'next-video-editor'
});

app.get('/__gtg', controllers.gtg);
app.get('/', controllers.edit);

const listen = app.listen(process.env.PORT || 3001);

module.exports = {
	listen
};
}
catch(e) {
	console.log(e);
}
