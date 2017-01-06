const querystring = require('querystring');

module.exports = tags => {
	const getThings = [].concat(tags || [])
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
