const tag = () => {
	[...document.querySelectorAll('.js-tag')]
		.forEach(tag => {
			tag.addEventListener('keyup', function () {
				fetch(`https://tag-facets-api.ft.com/?partial=${this.value}&minimum=0&count=5`)
					.then(() => {
					});
			});
		});
};

export default tag;
