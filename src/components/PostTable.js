import React, { useState, useMemo, useEffect, useContext } from 'react';
import axios from 'axios';
import { SortableHeader } from './SortableHeader';
import { SearchContext } from './../App';
import { Modal } from './Modal';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const PostTable = ({ posts, headers }) => {
	const [orderedPosts, setOrderedPosts] = useState([]);
	const [filteredPosts, setFilteredPosts] = useState([]);
	const [displayIndexStatus, setDisplayIndexStatus] = useState(false);
	const [currentSort, setCurrentSort] = useState({
		key: 'createdDate',
		isAscending: false,
	});
	const [displayModal, setDisplayModal] = useState(false);
	const [outline, setOutline] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [numOfSerps, setNumOfSerps] = useState(0);
	const searchContext = useContext(SearchContext);
	const APIKEY = '71781d1a14888d20d75832cf627b387d83c19cd798a089db7755d72b2cca5295';
	const searchUrl = `https://serpapi.com/search.json?engine=google&q=site:${headers.baseAddress}&api_key=${APIKEY}`;

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

	useEffect(() => { }, [orderedPosts]);

	useEffect(() => {
		function filterPosts(searchValue) {
			const filteredOrderedPosts = orderedPosts.filter(
				o =>
					o.title.toUpperCase().includes(searchValue.toUpperCase()) ||
					o.categoryNames.toUpperCase().includes(searchValue.toUpperCase())
			);
			setFilteredPosts(filteredOrderedPosts);
		}

		filterPosts(searchContext.searchState);
	}, [orderedPosts, searchContext.searchState]);

	function displayOutline(outline) {
		setOutline(outline);
		setDisplayModal(true);
	}

	function closeModal() {
		setDisplayModal(false);
	}

	const copyToClipboard = (url) => {
		console.log("copy url", url);
		navigator.clipboard.writeText(url);
		toast.success(`Copied to clipboard: ${url}`, {
			position: "top-right",
			autoClose: 3000,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
			progress: undefined,
		});
	}

	const checkForIndex = async () => {
		setIsLoading(true);
		let serpUrls = [];
		let hasNext = true;

		let response;

		try {
			response = await axios.get(searchUrl);
		} catch (error) {
			console.log("error", error)
			setDisplayIndexStatus(true);
			setIsLoading(false);
		}

		const { organic_results } = response.data;
		let serpPagination = response.data.serpapi_pagination;
		serpUrls = collectUrls(organic_results);

		while (hasNext) {
			let serpPaginationNext = serpPagination.next;
			if (serpPaginationNext) {
				const url = `${serpPaginationNext}&api_key=${APIKEY}`;
				try {
					response = await axios.get(url);
					const { organic_results } = response.data;
					serpPagination = response.data.serpapi_pagination;
					let paginatedSerpUrls = collectUrls(organic_results);
					serpUrls = [...serpUrls, ...paginatedSerpUrls];
					setNumOfSerps(serpUrls.length);
				} catch (error) {
					console.log("error", error)
					hasNext = false;
				}
			}
			else {
				hasNext = false;
			}
		}

		setIndexedFields(serpUrls);
		setDisplayIndexStatus(true);
		setIsLoading(false);
	}


	const collectUrls = (organic_results) => {
		const serpLinks = organic_results.map(result => result.link);
		return serpLinks;
	}

	const setIndexedFields = (serpUrls) => {
		filteredPosts.forEach(post => {
			const url = serpUrls.find(url => url === post.link);
			post.isIndexed = url ? "" : "Not Indexed";
		})

		setFilteredPosts([...filteredPosts]);
	}

	return (
		<div>
			<ToastContainer />
			{displayModal && (
				<div className='bg-gray-900 h-screen opacity-75 fixed top-0 bottom-0 left-0 right-0'></div>
			)}
			<div className="flex justify-between align items-end">
				<div>
					<span>Filter posts</span>
					<input
						type='text'
						onChange={e =>
							searchContext.searchDispatch({
								type: 'SET_SEARCH_VALUE',
								payload: e.target.value,
							})
						}
						value={searchContext.searchState}
						className='w-64 px-4 py-1 mt-4 ml-4 leading-normal bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:shadow-outline'
					/>
					<button
						className='px-4 py-1 ml-1 border rounded-lg focus:outline-none focus:shadow-outline'
						onClick={() =>
							searchContext.searchDispatch({
								type: 'SET_SEARCH_VALUE',
								payload: '',
							})
						}>
						Reset
					</button>
					<span className='ml-4'>Number of Posts: {filteredPosts.length}</span>
					{displayIndexStatus && <span className='ml-4 text-green-500'>Indexed: {filteredPosts.filter(f => !f.isIndexed).length}</span>}
					{displayIndexStatus && <span className='ml-4 text-red-500'>Not Indexed: {filteredPosts.filter(f => f.isIndexed).length}</span>}
					{numOfSerps > 0 && <span className='ml-4'> Number of serps: {numOfSerps}</span>}
				</div>
				<div className="flex">
					<button
						className='px-4 py-1 ml-1 border rounded-lg focus:outline-none focus:shadow-outline'
						onClick={() =>
							checkForIndex()
						}>
						Check index
					</button>
					{isLoading && <div className='w-8 h-8 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader inline-block ml-4'></div>}
				</div>
			</div>
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
							width={displayIndexStatus ? 'w-1/7' : 'w-1/4'}
							fieldname='categoryNames'
							currentSort={currentSort}
							setCurrentSort={setCurrentSort}>
							Categories
						</SortableHeader>
						<SortableHeader
							width='w-2/5'
							fieldname='title'
							currentSort={currentSort}
							setCurrentSort={setCurrentSort}>
							Title
						</SortableHeader>
						<SortableHeader
							fieldname='numberOfWords'
							currentSort={currentSort}
							setCurrentSort={setCurrentSort}>
							Words
						</SortableHeader>
						{displayIndexStatus && <SortableHeader
							fieldname='isIndexed'
							currentSort={currentSort}
							setCurrentSort={setCurrentSort}>
							In SERP?
						</SortableHeader>}
						<th className='px-4 py-2 text-left bg-gray-300'></th>
					</tr>
				</thead>
				<tbody>
					{filteredPosts.map((post, index) => (
						<tr
							key={post.id}
							className={`${index % 2 !== 0 ? 'bg-gray-200' : ''}`}>
							<td className='px-4 py-2 border'>{post.createdDate}</td>
							<td className='px-4 py-2 border'>{post.categoryNames}</td>
							<td className='px-4 py-2 border'>
								<div className='flex justify-between'>
									<a
										className='text-blue-600 visited:text-blue-800 hover:text-blue-300'
										href={post.link}
										target='_blank'
										rel='noopener noreferrer'>
										{post.title}
									</a>
									<button type="button"
										onClick={() => copyToClipboard(post.link)}
										className='focus:outline-none'>
										<svg version="1.1" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
											<path d="M23.783 25.851v-17.501h-2.149v3.275h-10.951v-3.275h-2.149v17.501h15.249zM16.158 6.201c-0.614 0-1.075 0.461-1.075 1.075s0.461 1.075 1.075 1.075c0.614 0 1.075-0.461 1.075-1.075s-0.461-1.075-1.075-1.075v0zM23.783 6.201c1.177 0 2.201 0.973 2.201 2.149v17.501c0 1.177-1.023 2.149-2.201 2.149h-15.249c-1.177 0-2.201-0.973-2.201-2.149v-17.501c0-1.177 1.023-2.149 2.201-2.149h4.555c0.461-1.28 1.637-2.201 3.070-2.201s2.61 0.921 3.070 2.201h4.554z"></path>
										</svg>
									</button>
								</div>
							</td>
							<td className='px-4 py-2 border'>{post.numberOfWords}</td>
							{displayIndexStatus && <td className='px-4 py-2 border'>{post.isIndexed}</td>}
							<td className='px-4 py-2 text-center border'>
								<a
									href={`https://www.google.com/search?q=${post.title}`}
									target='_blank'
									rel='noopener noreferrer'>
									<svg
										className='inline-block w-6 h-6'
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 20 20'>
										<path d='M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z' />
									</svg>
								</a>
								<button
									type='button'
									onClick={() => displayOutline(post.outline)}
									className='focus:outline-none'>
									<svg
										className='inline-block w-6 h-6 ml-2'
										xmlns='http://www.w3.org/2000/svg'
										viewBox='0 0 20 20'>
										<path d='M1 1h18v2H1V1zm0 8h18v2H1V9zm0 8h18v2H1v-2zM1 5h18v2H1V5zm0 8h18v2H1v-2z' />
									</svg>
								</button>
							</td>
						</tr>
					))}
				</tbody>
			</table>
			{displayModal && <Modal outline={outline} closeModal={closeModal} />}
		</div>
	);
};
