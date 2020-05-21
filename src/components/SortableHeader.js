import React, { useState, useEffect } from 'react';

export const SortableHeader = ({
	children,
	fieldname,
	currentSort,
	setCurrentSort,
	width,
}) => {
	const [sortedHeader, setSortedHeader] = useState(currentSort);

	useEffect(() => {
		setSortedHeader(currentSort);
	}, [currentSort]);

	function toggleHeader() {
		if (currentSort.key === fieldname) {
			setCurrentSort({ key: fieldname, isAscending: !currentSort.isAscending });
		} else {
			setCurrentSort({ key: fieldname, isAscending: false });
		}
	}

	return (
		<th className={`px-4 py-2 bg-gray-300 text-left ${width ? width : ''}`}>
			<button onClick={toggleHeader} className='font-bold focus:outline-none'>
				{children}
			</button>

			{sortedHeader.key === fieldname && !sortedHeader.isAscending && (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					className='w-6 inline-block ml-1'>
					<path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
				</svg>
			)}
			{sortedHeader.key === fieldname && sortedHeader.isAscending && (
				<svg
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 20 20'
					className='w-6 inline-block ml-1'>
					<path d='M10.707 7.05L10 6.343 4.343 12l1.414 1.414L10 9.172l4.243 4.242L15.657 12z' />
				</svg>
			)}
		</th>
	);
};
