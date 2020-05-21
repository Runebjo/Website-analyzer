import React, { useState, useMemo } from 'react';
import { SortableHeader } from './SortableHeader';

export const PostTable = ({ posts }) => {
	const [currentSort, setCurrentSort] = useState({
		key: 'createdDate',
		isAscending: false,
	});

	const orderedPosts = useMemo(() => {
		let orderedPosts = [...posts];
		orderedPosts.sort((a, b) => {
			if (a[currentSort.key] > b[currentSort.key]) {
				return currentSort.isAscending ? 1 : -1;
			}
			if (a[currentSort.key] < b[currentSort.key]) {
				return currentSort.isAscending ? -1 : 1;
			}
			return 0;
		});
		return orderedPosts;
	}, [currentSort.isAscending, currentSort.key, posts]);

	return (
		<table className='mt-4 table-fixed w-full'>
			<thead>
				<tr>
					<SortableHeader
						width='w-1/7'
						fieldname='createdDate'
						currentSort={currentSort}
						setCurrentSort={setCurrentSort}>
						Post Created
					</SortableHeader>
					<SortableHeader
						width='w-1/7'
						fieldname='modifiedDate'
						currentSort={currentSort}
						setCurrentSort={setCurrentSort}>
						Post Modified
					</SortableHeader>
					<SortableHeader
						width='w-2/5'
						fieldname='title'
						currentSort={currentSort}
						setCurrentSort={setCurrentSort}>
						Title
					</SortableHeader>
					<th className='px-4 py-2 bg-gray-300 text-left'>Google Search</th>
					<SortableHeader
						fieldname='numberOfWords'
						currentSort={currentSort}
						setCurrentSort={setCurrentSort}>
						Word Count
					</SortableHeader>
				</tr>
			</thead>
			<tbody>
				{orderedPosts.map((post, index) => (
					<tr
						key={post.id}
						className={`${index % 2 !== 0 ? 'bg-gray-200' : ''}`}>
						<td className='border px-4 py-2'>{post.createdDate}</td>
						<td className='border px-4 py-2'>{post.modifiedDate}</td>
						<td className='border px-4 py-2'>
							<a
								className='text-blue-600 visited:text-blue-800 hover:text-blue-300'
								href={post.link}
								target='_blank'
								rel='noopener noreferrer'>
								{post.title}
							</a>
						</td>
						<td className='border px-4 py-2'>
							<a
								className='text-blue-600 visited:text-blue-800 hover:text-blue-300'
								href={`https://www.google.com/search?q=${post.title}`}
								target='_blank'
								rel='noopener noreferrer'>
								Google Search
							</a>
						</td>
						<td className='border px-4 py-2'>{post.numberOfWords}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};
