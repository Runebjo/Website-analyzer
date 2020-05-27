import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { SortableHeader } from './SortableHeader';

export const Categories = ({ siteUrl }) => {
	const [categories, setCategories] = useState([]);
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
	useEffect(() => {
		axios
			.get(`${siteUrl}/wp-json/wp/v2/categories?per_page=100`)
			.then(response => {
				console.log('response.data', response.data);
				setCategories(response.data);
			});
	}, [siteUrl]);

	return (
		<table className='mt-4 table-auto'>
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
