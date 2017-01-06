module.exports = videoId => {
	if (videoId) {
		return fetch(`https://next-video.ft.com/api/${videoId}`)
			.then(response => response.json())
			.then(({ renditions = [], videoStillURL, name }) => {
				return {
					videoId: videoId,
					videoName: name,
					webUrl: `http://video.ft.com/${videoId}`,
					mainImage: {
						url: videoStillURL
					},
					attachments: renditions.map(rendition => ({
						url: rendition.url,
						width: rendition.frameWidth,
						height: rendition.frameHeight,
						duration: rendition.duration,
						mediaType: `video/${rendition.videoContainer.toLowerCase()}`
					}))
				}
			});
	} else {
		return Promise.resolve({});
	}
};
