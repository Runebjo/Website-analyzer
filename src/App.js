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
	const [website, setWebsite] = useState('');
	const [isLoadingHeaders, setIsLoadingHeaders] = useState(false);
	const [isHttpError, setIsHttpError] = useState(false);
	const [siteUrl, setSiteUrl] = useState('');

	function submitUrl(e) {
		e.preventDefault();
		setWebsite(urlInput);
		setIsHttpError(false);
		setPosts([]);

		const blogUrl =
			urlInput.startsWith('https://') || urlInput.startsWith('http://')
				? urlInput
				: `https://${urlInput}`;

		setUrl(`${blogUrl}/wp-json/wp/v2/posts`);
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

	useEffect(() => {
		async function getHeaderData() {
			const response = await axios.get(url);
			const headers = {
				totalPages: response.headers['x-wp-totalpages'],
				totalPosts: response.headers['x-wp-total'],
				baseAddress: siteUrl,
			};
			setHeaders(headers);
			return headers;
		}
		async function getAllPosts(totalPages) {
			const posts = [];
			for (let page = 1; page <= totalPages; page++) {
				const post = axios.get(`${url}?per_page=10&page=${page}`);
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
				};
			});
			setPosts(processedPost);
			setCategories(categories);
		}
		if (website) {
			try {
				setIsLoadingHeaders(true);
				addData();
				setIsLoadingHeaders(false);
			} catch (error) {
				setIsHttpError(true);
				setIsLoadingHeaders(false);
			}
		}
	}, [siteUrl, url, website]);

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

			{website && !isLoadingHeaders && !isHttpError && posts.length > 0 ? (
				<div className='mt-4'>
					<div className='flex'>
						<Overview posts={posts} headers={headers} />
						<Categories categories={categories} />
						<Stats posts={posts} />
					</div>
					<PostTable posts={posts} />
				</div>
			) : (
				website && !isHttpError && <h5>Loading posts...</h5>
			)}
		</div>
	);
}

export default App;
