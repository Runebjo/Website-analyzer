import React, { useState, useMemo, useContext } from 'react';
import { SortableHeader } from './SortableHeader';
import { SearchContext } from '../App';

export const Categories = ({ categories, viewPosts }) => {
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
	const searchContext = useContext(SearchContext);

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
							<td
								className='px-4 py-2 text-blue-600 border cursor-pointer visited:text-blue-800 hover:text-blue-300 focus:outline-none'
								onClick={() => {
									searchContext.searchDispatch({
										type: 'SET_SEARCH_VALUE',
										payload: category.name,
									});
									viewPosts();
								}}>
								{category.name}
							</td>
							<td className='px-4 py-2 border'>{category.numberOfPosts}</td>
						</tr>
					))}
			</tbody>
		</table>
	);
};
