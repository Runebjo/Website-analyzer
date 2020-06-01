import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PostTable } from './components/PostTable';
import { Stats } from './components/Stats';
import { Overview } from './components/Overview';
import { Categories } from './components/Categories';

function App() {
	const [posts, setPosts] = useState([]);
	const [categories, setCategories] = useState([]);
	const [headers, setHeaders] = useState({});
	const [urlInput, setUrlInput] = useState('');
	const [url, setUrl] = useState('');
	const [isLoadingHeaders, setIsLoadingHeaders] = useState(false);
	const [isHttpError, setIsHttpError] = useState(false);
	const [siteUrl, setSiteUrl] = useState('');
	const [overviewIsActive, setOverviewIsActive] = useState(true);

	function submitUrl(e) {
		e.preventDefault();
		setIsHttpError(false);
		setPosts([]);

		const blogUrl =
			urlInput.startsWith('https://') || urlInput.startsWith('http://')
				? urlInput
				: `https://${urlInput}`;

		setUrl(`${blogUrl}/wp-json/wp/v2/posts?per_page=100`);
		setSiteUrl(blogUrl);
	}

	function decodeHtml(html) {
		var txt = document.createElement('textarea');
		txt.innerHTML = html;
		return txt.value;
	}

	function countWords(str) {
		str = str.replace(/(^\s*)|(\s*$)/gi, '');
		str = str.replace(/[ ]{2,}/gi, ' ');
		str = str.replace(/\n /, '\n');
		str = str.replace(/<[^>]*>?/gm, '');
		return str.split(' ').length;
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

	useEffect(() => {
		async function getHeaderData() {
			const response = await axios.get(url);
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
			for (let page = 1; page <= totalPages; page++) {
				const post = axios.get(`${url}&page=${page}`);
				posts.push(post);
			}
			const allPosts = await axios.all(posts);
			return allPosts;
		}
		async function getCategories() {
			const response = await axios.get(
				`${siteUrl}/wp-json/wp/v2/categories?per_page=100`
			);
			const categories = response.data;
			return categories;
		}
		async function addData() {
			setIsLoadingHeaders(true);
			const headerData = await getHeaderData();
			const allPosts = await getAllPosts(headerData.totalPages);
			const categories = await getCategories();
			const postFlattened = allPosts.map(a => a.data).flat();
			const processedPost = postFlattened.map(p => {
				return {
					id: p.id,
					createdDate: p.date.substr(0, 10),
					modifiedDate: p.modified.substr(0, 10),
					title: decodeHtml(p.title.rendered),
					numberOfWords: countWords(p.content.rendered),
					link: p.link,
					categories: p.categories,
					categoryNames: p.categories
						.map(categoryId => {
							const category = categories.find(c => c.id === categoryId);
							return category.name;
						})
						.join(' | '),
				};
			});
			const categoriesProcessed = addNumberOfPostsInCategories(
				categories,
				processedPost
			);
			setPosts(processedPost);
			setCategories(categoriesProcessed);
		}
		if (siteUrl) {
			try {
				setIsLoadingHeaders(true);
				addData();
				setIsLoadingHeaders(false);
			} catch (error) {
				console.log('httpError', error);
				setIsHttpError(true);
				setIsLoadingHeaders(false);
			}
		}
	}, [siteUrl, url]);

	return (
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

			{isHttpError && <h3>Error getting data from website</h3>}

			{!isLoadingHeaders && !isHttpError && posts.length > 0 ? (
				<>
					<div className='mt-8'>
						<button
							onClick={() => setOverviewIsActive(true)}
							className={`text-blue-600 visited:text-blue-800 hover:text-blue-300 focus:outline-none ${
								overviewIsActive ? 'underline' : ''
							}`}>
							Overview
						</button>
						<button
							onClick={() => setOverviewIsActive(false)}
							className={`ml-4 text-blue-600 visited:text-blue-800 hover:text-blue-300 focus:outline-none ${
								!overviewIsActive ? 'underline' : ''
							}`}>
							Posts
						</button>
					</div>
					<div className='mt-4'>
						{overviewIsActive && (
							<div className='flex'>
								<Overview posts={posts} headers={headers} />
								<Categories categories={categories} />
								<Stats posts={posts} />
							</div>
						)}
						{!overviewIsActive && <PostTable posts={posts} />}
					</div>
				</>
			) : (
				siteUrl &&
				!isHttpError && (
					<h5>Loading {headers && headers.totalPosts} posts...</h5>
				)
			)}
		</div>
	);
}

export default App;
