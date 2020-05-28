import React, { useState, useMemo, useEffect } from 'react';
import { SortableHeader } from './SortableHeader';

export const PostTable = ({ posts }) => {
	const [orderedPosts, setOrderedPosts] = useState([]);
	const [filteredPosts, setFilteredPosts] = useState([]);
	const [currentSort, setCurrentSort] = useState({
		key: 'createdDate',
		isAscending: false,
	});

	useMemo(() => {
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
		setOrderedPosts(orderedPosts);
		setFilteredPosts(orderedPosts);
	}, [currentSort.isAscending, currentSort.key, posts]);

	useEffect(() => {}, [orderedPosts]);

	function filterPosts({ target }) {
		const inputValue = target.value;
		console.log(inputValue);
		console.log('orderedPosts', orderedPosts);
		const filteredOrderedPosts = orderedPosts.filter(o =>
			o.title.toUpperCase().includes(inputValue.toUpperCase())
		);
		console.log('filteredOrderedPosts', filteredOrderedPosts);
		setFilteredPosts(filteredOrderedPosts);
	}

	return (
		<div>
			<span>Filter posts</span>
			<input
				type='text'
				onChange={filterPosts}
				className='w-64 px-4 py-1 mt-4 ml-4 leading-normal bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:shadow-outline'
			/>
			<span className='ml-4'>Number of Posts: {filteredPosts.length}</span>
			<table className='w-full mt-4 table-fixed'>
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
						<th className='px-4 py-2 text-left bg-gray-300'>Google Search</th>
						<SortableHeader
							fieldname='numberOfWords'
							currentSort={currentSort}
							setCurrentSort={setCurrentSort}>
							Word Count
						</SortableHeader>
					</tr>
				</thead>
				<tbody>
					{filteredPosts.map((post, index) => (
						<tr
							key={post.id}
							className={`${index % 2 !== 0 ? 'bg-gray-200' : ''}`}>
							<td className='px-4 py-2 border'>{post.createdDate}</td>
							<td className='px-4 py-2 border'>{post.modifiedDate}</td>
							<td className='px-4 py-2 border'>
								<a
									className='text-blue-600 visited:text-blue-800 hover:text-blue-300'
									href={post.link}
									target='_blank'
									rel='noopener noreferrer'>
									{post.title}
								</a>
							</td>
							<td className='px-4 py-2 border'>
								<a
									className='text-blue-600 visited:text-blue-800 hover:text-blue-300'
									href={`https://www.google.com/search?q=${post.title}`}
									target='_blank'
									rel='noopener noreferrer'>
									Google Search
								</a>
							</td>
							<td className='px-4 py-2 border'>{post.numberOfWords}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};
