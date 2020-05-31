import React, { useState, useMemo } from 'react';
import { SortableHeader } from './SortableHeader';

export const Categories = ({ categories }) => {
	const [currentSort, setCurrentSort] = useState({
		key: 'numberOfPosts',
		isAscending: false,
	});
	const orderedCategories = useMemo(() => {
		let orderedCategories = [...categories];
		orderedCategories.sort((a, b) => {
			if (a[currentSort.key] > b[currentSort.key]) {
				return currentSort.isAscending ? 1 : -1;
			}
			if (a[currentSort.key] < b[currentSort.key]) {
				return currentSort.isAscending ? -1 : 1;
			}
			return 0;
		});
		return orderedCategories;
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
					<SortableHeader
						fieldname='numberOfPosts'
						currentSort={currentSort}
						setCurrentSort={setCurrentSort}>
						Number of Posts
					</SortableHeader>
				</tr>
			</thead>
			<tbody>
				{orderedCategories &&
					orderedCategories.map((category, index) => (
						<tr
							key={category.id}
							className={`${index % 2 !== 0 ? 'bg-gray-200' : ''}`}>
							<td className='px-4 py-2 border'>{category.name}</td>
							<td className='px-4 py-2 border'>{category.numberOfPosts}</td>
						</tr>
					))}
			</tbody>
		</table>
	);
};
