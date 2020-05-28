import React, { useState, useMemo } from 'react';
import { SortableHeader } from './SortableHeader';

export const Categories = ({ categories }) => {
	const [currentSort, setCurrentSort] = useState({
		key: 'name',
		isAscending: true,
	});
	const orderedCategories = useMemo(() => {
		let orderedPosts = [...categories];
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
	}, [categories, currentSort.isAscending, currentSort.key]);

	return (
		<table className='mt-4 ml-4 table-auto'>
			<thead>
				<tr>
					<SortableHeader
						fieldname='name'
						currentSort={currentSort}
						setCurrentSort={setCurrentSort}>
						Category
					</SortableHeader>
					<th className={`px-4 py-2 bg-gray-300 text-left`}>Number of Posts</th>
				</tr>
			</thead>
			<tbody>
				{orderedCategories &&
					orderedCategories.map((category, index) => (
						<tr
							key={category.id}
							className={`${index % 2 !== 0 ? 'bg-gray-200' : ''}`}>
							<td className='px-4 py-2 border'>{category.name}</td>
							<td className='px-4 py-2 border'>N/A</td>
						</tr>
					))}
			</tbody>
		</table>
	);
};
