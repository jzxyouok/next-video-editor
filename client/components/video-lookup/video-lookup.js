import React from 'react';
import { render } from 'react-dom';
import ReactTags from 'react-tag-autocomplete';

const updateVideo = (id, autocompleteEl) => {
	autocompleteEl.parentNode.querySelector('#video').value = id;
};

export default videoLookupContainerEl => {
	if (!videoLookupContainerEl) {
		return;
	}
	const tags = [];
	const videoId = videoLookupContainerEl.getAttribute('data-video-id');
	const videoName = videoLookupContainerEl.getAttribute('data-video-name');
	if (videoName && videoId) {
		tags.push({ id: videoId, name: videoName });
	}
	const VideoLookup = React.createClass({
		getInitialState: function () {
			return {
				tags,
				suggestions: []
			}
		},
		handleAddition: function (video) {
			updateVideo(video.id, videoLookupContainerEl);
			this.setState({ tags: [video] })
		},
		handleDelete: function () {
			updateVideo('', videoLookupContainerEl);
			this.setState({ tags: [] })
		},
		handleInputChange: function (value) {
			fetch(`https://next-video.ft.com/api/search?all=display_name:${value}&video_fields=id,name&page_size=5`)
				.then(response => {
					if (response.ok) {
						return response.json();
					} else {
						throw new Error(`Bad response from tag-facets-api: ${response.status}`);
					}
				})
				.then(({ items: results }) => {
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
					handleInputChange={this.handleInputChange}
					placeholder="Search for video" />
			);
		}
	});

	render(<VideoLookup />, videoLookupContainerEl)
};
