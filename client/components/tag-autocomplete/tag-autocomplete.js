import React from 'react';
import { render } from 'react-dom';
import ReactTags from 'react-tag-autocomplete';

const addTag = (id, autocompleteEl) => {
	const tagEl = document.createElement('input');
	tagEl.type = 'hidden';
	tagEl.value = id;
	tagEl.name = 'tags';
	autocompleteEl.parentNode.insertBefore(tagEl, autocompleteEl);
};

const removeTag = (id, autocompleteEl) => {
	autocompleteEl.parentNode.querySelectorAll(`[value="${id}"]`)
		.forEach(tagEl => {
			autocompleteEl.parentNode.removeChild(tagEl);
		});
};

export default tagAutocompleteContainerEl => {
	if (!tagAutocompleteContainerEl) {
		return;
	}
	const TagAutocomplete = React.createClass({
		getInitialState: function () {
			return {
				tags: JSON.parse(tagAutocompleteContainerEl.getAttribute('data-tags') || '[]'),
				suggestions: []
			}
		},
		handleAddition: function (tag) {
			addTag(tag.id, tagAutocompleteContainerEl);
			const tags = this.state.tags;
			tags.push(tag)
			this.setState({ tags })
		},
		handleDelete: function (i) {
			removeTag(this.state.tags[i].id, tagAutocompleteContainerEl);
			this.state.tags.splice(i, 1);
			this.setState({ tags: this.state.tags })
		},
		handleInputChange: function (value) {
			fetch(`https://tag-facets-api.ft.com/?partial=${value.toLowerCase()}&minimum=0&count=5`)
				.then(response => {
					if (response.ok) {
						return response.json();
					} else {
						throw new Error(`Bad response from tag-facets-api: ${response.status}`);
					}
				})
				.then(results => {
					this.setState({ suggestions: results });
				})
				.catch();
		},
		render: function () {
			return (
				<ReactTags
					tags={this.state.tags}
					suggestions={this.state.suggestions}
					handleAddition={this.handleAddition}
					handleDelete={this.handleDelete}
					handleInputChange={this.handleInputChange} />
			);
		}
	});

	render(<TagAutocomplete />, tagAutocompleteContainerEl)
};
