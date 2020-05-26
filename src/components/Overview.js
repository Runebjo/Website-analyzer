import React from 'react';

export const Overview = ({ posts }) => {
	const margin = 100;
	const responsePost = 1250 - margin;
	const staplePost = 2500 - margin;
	const pillarPost = 3500 - margin;

	const numberOfTinyPosts = posts.filter(p => p.numberOfWords < responsePost)
		.length;
	const numberOfResponsePosts = posts.filter(
		p => p.numberOfWords >= responsePost && p.numberOfWords < staplePost
	).length;
	const numberOfStaplePosts = posts.filter(
		p => p.numberOfWords >= staplePost && p.numberOfWords < pillarPost
	).length;
	const numberOfPillarPosts = posts.filter(p => p.numberOfWords >= pillarPost)
		.length;

	return (
		<div>
			<div>
				<strong>Tiny posts (less than 1250 words): </strong>
				{numberOfTinyPosts}
			</div>
			<div>
				<strong>Response posts (1250+ words): </strong>
				{numberOfResponsePosts}
			</div>
			<div>
				<strong>Staple posts (2500+ words): </strong>
				{numberOfStaplePosts}
			</div>
			<div>
				<strong>Pillar posts (3500+ words): </strong>
				{numberOfPillarPosts}
			</div>
		</div>
	);
};
