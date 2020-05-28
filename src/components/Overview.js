import React from 'react';

export const Overview = ({ posts, headers }) => {
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
		<table className='mt-4 table-auto'>
			<thead>
				<tr>
					<th colSpan='2' className={`px-4 py-2 bg-gray-300 text-left`}>
						Overview
					</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td className='px-4 py-2 border'>Website</td>
					<td className='px-4 py-2 border'>{headers.baseAddress}</td>
				</tr>
				<tr className='bg-gray-200'>
					<td className='px-4 py-2 border'>Total Posts</td>
					<td className='px-4 py-2 border'>{headers.totalPosts}</td>
				</tr>
				<tr>
					<td className='px-4 py-2 border'>
						Tiny posts (less than 1250 words)
					</td>
					<td className='px-4 py-2 border'>{numberOfTinyPosts}</td>
				</tr>
				<tr className='bg-gray-200'>
					<td className='px-4 py-2 border'>Response posts (1250+ words)</td>
					<td className='px-4 py-2 border'>{numberOfResponsePosts}</td>
				</tr>
				<tr>
					<td className='px-4 py-2 border'>Staple posts (2500+ words)</td>
					<td className='px-4 py-2 border'>{numberOfStaplePosts}</td>
				</tr>
				<tr className='bg-gray-200'>
					<td className='px-4 py-2 border'>Pillar posts (3500+ words)</td>
					<td className='px-4 py-2 border'>{numberOfPillarPosts}</td>
				</tr>
			</tbody>
		</table>
	);
};
