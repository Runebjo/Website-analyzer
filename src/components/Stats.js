import React, { useState, useMemo } from 'react';
import { SortableHeader } from './SortableHeader';

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

	function getMonth(month) {
		switch (month) {
			case '01':
				return 'January';
			case '02':
				return 'February';
			case '03':
				return 'March';
			case '04':
				return 'April';
			case '05':
				return 'May';
			case '06':
				return 'June';
			case '07':
				return 'July';
			case '08':
				return 'August';
			case '09':
				return 'September';
			case '10':
				return 'October';
			case '11':
				return 'November';
			case '12':
				return 'December';
			default:
				return month;
		}
	}

	return (
		<table className='mt-4 table-auto'>
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
