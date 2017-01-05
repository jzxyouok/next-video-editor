const tag = () => {
	[...document.querySelectorAll('.js-tag')]
		.forEach(tag => {
			tag.addEventListener('keyup', function (ev) {
				fetch(`https://tag-facets-api.ft.com/?partial=${this.value}&minimum=0&count=5`)
					.then(response => {
						console.log(repsponse);
					});
			});
		});
};

export default tag;
