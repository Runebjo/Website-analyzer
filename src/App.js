import React, { useEffect, useState, useReducer } from 'react';
import axios from 'axios';
import { PostTable } from './components/PostTable';
import { Stats } from './components/Stats';
import { Overview } from './components/Overview';
import { Categories } from './components/Categories';
import { Authors } from './components/Authors';
import { Links } from './components/Links';
import { countWords, decodeHtml, getLinkData, getOutline } from './utils/ContentScraper';
import { reducer } from './Reducer';
import { DispatchTypes } from './utils/DispatchTypes';

export const SearchContext = React.createContext();

function App() {
	const [posts, setPosts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [authors, setAuthors] = useState([]);
	const [links, setLinks] = useState([]);
	const [headers, setHeaders] = useState({});
	const [urlInput, setUrlInput] = useState('');
	const [url, setUrl] = useState('');
	const [isLoadingHeaders, setIsLoadingHeaders] = useState(false);
	const [isHttpError, setIsHttpError] = useState(false);
	const [siteUrl, setSiteUrl] = useState('');
	const [overviewIsActive, setOverviewIsActive] = useState(true);
	const [searchValue, dispatch] = useReducer(reducer, '');
	const [cors, setCors] = useState(false);
	const [disableCache, setDisableCache] = useState(false);

	function submitUrl(e) {
		e.preventDefault();
		setIsHttpError(false);
		setPosts([]);
		setHeaders({});
		setOverviewIsActive(true);

		dispatch({
			type: DispatchTypes.SET_SEARCH_VALUE,
			payload: '',
		});

		const blogUrl =
			urlInput.startsWith('https://') || urlInput.startsWith('http://')
				? urlInput
				: `https://${urlInput}`;

		const wpUrl = cors
			? `https://cors-anywhere.herokuapp.com/${blogUrl}/wp-json/wp/v2/posts?per_page=20`
			: `${blogUrl}/wp-json/wp/v2/posts?per_page=20`

		setUrl(
			wpUrl
		);
		setSiteUrl(blogUrl);
	}

	function addNumberOfPostsInCategories(categories, posts) {
		const categoryiesWithNumberOfPosts = categories.map(category => {
			return {
				id: category.id,
				name: category.name,
				numberOfPosts: posts.filter(post =>
					post.categories.includes(category.id)
				).length,
			};
		});
		return categoryiesWithNumberOfPosts;
	}

	function addNumberOfPostsInAuthors(authors, posts) {
		const authorsWithNumberOfPosts = authors.map(author => {
			return {
				id: author.id,
				name: author.name,
				numberOfPosts: posts.filter(post =>
					post.author === author.id
				).length,
			};
		});
		return authorsWithNumberOfPosts;
	}

	function getLinkOverview(posts) {
		const links = posts.filter(post => post.linkData.length > 0).map(post => {
			return {
				postTitle: post.title,
				linkData: post.linkData,
				tags: [...new Set(post.linkData.map(ld => ld.tag))]
			}
		});
		return links;
	}

	useEffect(() => {
		async function getHeaderData() {
			const currentUrl = disableCache ? `${url}&cb=${Date.now()}` : url;
			const response = await axios.get(currentUrl);
			const headers = {
				totalPages: response.headers['x-wp-totalpages'],
				totalPosts: response.headers['x-wp-total'],
				baseAddress: siteUrl,
			};
			console.log('totalPosts', headers.totalPosts);
			console.log('totalPages', headers.totalPages);
			setHeaders(headers);
			return headers;
		}
		async function getAllPosts(totalPages) {
			const posts = [];
			const currentUrl = disableCache ? `${url}&cb=${Date.now()}` : url;
			for (let page = 1; page <= totalPages; page++) {
				const post = axios.get(currentUrl);
				posts.push(post);
			}
			const allPosts = await axios.all(posts);
			return allPosts;
		}
		async function getCategories() {
			const wpUrl = cors ? `https://cors-anywhere.herokuapp.com/${siteUrl}/wp-json/wp/v2/categories?per_page=100` : `${siteUrl}/wp-json/wp/v2/categories?per_page=100`;
			const response = await axios.get(
				wpUrl
			);
			const categories = response.data;
			return categories;
		}
		async function getAuthors() {
			const wpUrl = cors ? `https://cors-anywhere.herokuapp.com/${siteUrl}/wp-json/wp/v2/users?per_page=100` : `${siteUrl}/wp-json/wp/v2/users?per_page=100`;
			const response = await axios.get(
				wpUrl
			);
			const authors = response.data;
			return authors;
		}
		async function addData() {
			setIsLoadingHeaders(true);
			try {
				const headerData = await getHeaderData();
				const allPosts = await getAllPosts(headerData.totalPages);
				const categories = await getCategories();
				const authors = await getAuthors();
				const postFlattened = allPosts.map(a => a.data).flat();
				const processedPost = postFlattened
					.filter(p => p !== '')
					.map(p => {
						return {
							id: p.id,
							createdDate: p.date.substr(0, 10),
							modifiedDate: p.modified.substr(0, 10),
							title: decodeHtml(p.title.rendered),
							numberOfWords: countWords(p.content.rendered),
							outline: getOutline(p.content.rendered),
							link: p.link,
							linkData: getLinkData(p.content.rendered),
							categories: p.categories,
							author: p.author,
							categoryNames: p.categories
								.map(categoryId => {
									const category = categories.find(c => c.id === categoryId);
									return category?.name || '';
								})
								.join(' | '),
						};
					});
				const categoriesProcessed = addNumberOfPostsInCategories(
					categories,
					processedPost
				);
				const authorsProcessed = addNumberOfPostsInAuthors(
					authors,
					processedPost
				)
				const linksProcessed = getLinkOverview(processedPost);
				setPosts(processedPost);
				setCategories(categoriesProcessed);
				setAuthors(authorsProcessed);
				setLinks(linksProcessed);
			} catch (error) {
				console.log('error', error);
				setIsHttpError(true);
				setIsLoadingHeaders(false);
			}
		}
		if (siteUrl) {
			setIsLoadingHeaders(true);
			addData();
			setIsLoadingHeaders(false);
		}
	}, [siteUrl, url]);

	function viewPosts() {
		setOverviewIsActive(false);
	}

	return (
		<SearchContext.Provider
			value={{ searchState: searchValue, searchDispatch: dispatch }}>
			<div className='container mx-auto mb-8'>
				<form onSubmit={submitUrl}>
					<input
						type='text'
						name='url'
						value={urlInput}
						placeholder='Enter website url...'
						onChange={e => setUrlInput(e.target.value)}
						onFocus={e => setUrlInput('')}
						className='w-64 px-4 py-1 mt-4 leading-normal bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:shadow-outline'
					/>
					<button className='px-4 py-1 ml-1 border rounded-lg focus:outline-none focus:shadow-outline'>
						Search
					</button>
				</form>
				<input type="checkbox" onChange={() => setCors(!cors)}></input><span className="ml-2">Use cors</span>
				<input className="ml-4" type="checkbox" onChange={() => setDisableCache(!disableCache)}></input><span className="ml-2">Disable cache</span>
				{isHttpError && <h3>Error getting data from website</h3>}
				{!isLoadingHeaders && !isHttpError && posts.length > 0 ? (
					<>
						<div className='mt-8'>
							<button
								onClick={() => setOverviewIsActive(true)}
								className={`text-blue-600 visited:text-blue-800 hover:text-blue-300 focus:outline-none ${overviewIsActive ? 'underline' : ''
									}`}>
								Overview
							</button>
							<button
								onClick={() => setOverviewIsActive(false)}
								className={`ml-4 text-blue-600 visited:text-blue-800 hover:text-blue-300 focus:outline-none ${!overviewIsActive ? 'underline' : ''
									}`}>
								Posts
							</button>
						</div>
						<div className='mt-4'>
							{overviewIsActive && (
								<div className='flex'>
									<div>
										<Overview posts={posts} headers={headers} authors={authors} viewPosts={viewPosts} />
										<Links links={links} />
										<Authors authors={authors} viewPosts={viewPosts} />
									</div>
									<Categories categories={categories} viewPosts={viewPosts} />
									<Stats posts={posts} />
								</div>
							)}
							{!overviewIsActive && <PostTable posts={posts} headers={headers} />}
						</div>
					</>
				) : (
						siteUrl &&
						!isHttpError && (
							<div className='fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center'>
								<div>
									<div className='w-32 h-32 ease-linear border-8 border-t-8 border-gray-200 rounded-full loader'></div>
									<h5 className='mt-4 text-center'>
										Loading {headers && headers.totalPosts} posts...
								</h5>
								</div>
							</div>
						)
					)}
			</div>
		</SearchContext.Provider>
	);
}

export default App;
