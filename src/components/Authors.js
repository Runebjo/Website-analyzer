import React, { useState, useMemo, useContext } from 'react';
import { SortableHeader } from './SortableHeader';
import { SearchContext } from '../App';
import { DispatchTypes } from '../utils/DispatchTypes';

export const Authors = ({ authors, viewPosts }) => {
	const [currentSort, setCurrentSort] = useState({
		key: 'numberOfPosts',
		isAscending: false,
	});
	const orderedAuthors = useMemo(() => {
		let orderedAuthors = [...authors];
		orderedAuthors.sort((a, b) => {
			if (a[currentSort.key] > b[currentSort.key]) {
				return currentSort.isAscending ? 1 : -1;
			}
			if (a[currentSort.key] < b[currentSort.key]) {
				return currentSort.isAscending ? -1 : 1;
			}
			return 0;
		});
		return orderedAuthors;
	}, [authors, currentSort.isAscending, currentSort.key]);
	const searchContext = useContext(SearchContext);

	return (
		<table className='mt-4 table-auto'>
			<thead>
				<tr>
					<SortableHeader
						fieldname='name'
						currentSort={currentSort}
						setCurrentSort={setCurrentSort}>
						Author
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
				{orderedAuthors &&
					orderedAuthors.map((author, index) => (
						<tr
							key={author.id}
							className={`${index % 2 !== 0 ? 'bg-gray-200' : ''}`}>
							<td
								className='px-4 py-2 text-blue-600 border cursor-pointer visited:text-blue-800 hover:text-blue-300 focus:outline-none'
								onClick={() => {
									searchContext.searchDispatch({
										type: DispatchTypes.SET_SEARCH_VALUE,
										payload: author.name,
									});
									viewPosts();
								}}>
								{author.name}
							</td>
							<td className='px-4 py-2 border'>{author.numberOfPosts}</td>
						</tr>
					))}
			</tbody>
		</table>
	);
};
