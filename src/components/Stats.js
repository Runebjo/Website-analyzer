import React, { useState, useMemo } from 'react';
import { SortableHeader } from './SortableHeader';
import { getMonth } from './../utils/DateHelper';

export const Stats = ({ posts }) => {
	const [currentSort, setCurrentSort] = useState({
		key: 'key',
		isAscending: false,
	});

	let postByMonthStatObject = {};

	posts.forEach(post => {
		const year = post.createdDate.substring(0, 4);
		const month = post.createdDate.substring(5, 7);

		if (postByMonthStatObject[`${year}:${month}`]) {
			postByMonthStatObject[`${year}:${month}`]++;
		} else {
			postByMonthStatObject[`${year}:${month}`] = 1;
		}
	});

	const date = new Date();

	const thisYearMonthKey = `${date.getFullYear()}:${(date.getMonth() + 1)
		.toString()
		.padStart(2, '0')}`;

	let firstPostDate = new Date(posts[posts.length - 1].createdDate);
	let currentDate = new Date(
		firstPostDate.getFullYear(),
		firstPostDate.getMonth(),
		1
	);

	let currentDateKey = `${currentDate.getFullYear()}:${(
		firstPostDate.getMonth() + 1
	)
		.toString()
		.padStart(2, '0')}`;

	firstPostDate = new Date(
		firstPostDate.setMonth(firstPostDate.getMonth() + 1)
	);

	while (currentDateKey <= thisYearMonthKey) {
		if (!postByMonthStatObject[currentDateKey]) {
			postByMonthStatObject[currentDateKey] = 0;
		}
		currentDate = new Date(currentDate.setMonth(currentDate.getMonth() + 1));
		currentDateKey = `${currentDate.getFullYear()}:${(
			currentDate.getMonth() + 1
		)
			.toString()
			.padStart(2, '0')}`;
	}

	let postByMonthStatArray = Object.keys(postByMonthStatObject).map(key => {
		return {
			key: key,
			year: key.substring(0, 4),
			month: getMonth(key.substring(5, 7)),
			count: postByMonthStatObject[key],
		};
	});

	const orderedPosts = useMemo(() => {
		let orderedPosts = [...postByMonthStatArray];
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
	}, [currentSort.isAscending, currentSort.key, postByMonthStatArray]);

	return (
		<table className='mt-4 ml-4 table-auto h-0'>
			<thead>
				<tr>
					<SortableHeader
						fieldname='key'
						currentSort={currentSort}
						setCurrentSort={setCurrentSort}>
						Year - Month
					</SortableHeader>
					<SortableHeader
						fieldname='count'
						currentSort={currentSort}
						setCurrentSort={setCurrentSort}>
						Number of Posts
					</SortableHeader>
				</tr>
			</thead>
			<tbody>
				{orderedPosts.map((post, index) => (
					<tr
						key={post.key}
						className={`${index % 2 !== 0 ? 'bg-gray-200' : ''}`}>
						<td className='px-4 py-2 border'>
							{post.year} - {post.month}
						</td>
						<td className='px-4 py-2 border'>{post.count}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
};
