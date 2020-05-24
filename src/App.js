import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PostTable } from './components/PostTable';
import { Stats } from './components/Stats';

function App() {
	const [urlInput, setUrlInput] = useState('');
	const [url, setUrl] = useState('');
	const [response, setResponse] = useState(null);
	const [website, setWebsite] = useState('');
	const [isLoadingHeaders, setIsLoadingHeaders] = useState(false);
	const [posts, setPosts] = useState([]);
	const [isHttpError, setIsHttpError] = useState(false);

	function submitUrl(e) {
		e.preventDefault();
		setWebsite(urlInput);
		setPosts([]);

		const blogUrl = urlInput.startsWith('https://')
			? urlInput
			: `https://${urlInput}`;
		setUrl(`${blogUrl}/wp-json/wp/v2/posts`);
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
		if (website) {
			setIsLoadingHeaders(true);
			axios
				.get(url)
				.then(response => {
					console.log(response);
					setResponse(response);
					setIsLoadingHeaders(false);
					function getPosts(totalPages) {
						const posts = [];
						for (let page = 1; page <= totalPages; page++) {
							const post = axios.get(`${url}?per_page=10&page=${page}`);
							posts.push(post);
						}
						axios
							.all(posts)
							.then(res => {
								const mappedPosts = res.map(r => r.data);
								const postpost = mappedPosts.flat();

								const processedPost = postpost.map(p => {
									return {
										id: p.id,
										createdDate: p.date.substr(0, 10),
										modifiedDate: p.modified.substr(0, 10),
										title: decodeHtml(p.title.rendered),
										numberOfWords: countWords(p.content.rendered),
										link: p.link,
									};
								});

								setPosts(processedPost);
							})
							.catch(error => {
								setIsHttpError(true);
								console.log(`Error getting posts: ${error}`);
							});
					}
					getPosts(response.headers['x-wp-totalpages']);
				})
				.catch(error => {
					console.log('error', error);
					setIsHttpError(true);
					setIsLoadingHeaders(false);
				});
		}
	}, [url, website]);

	return (
		<div className='container mx-auto'>
			<form onSubmit={submitUrl}>
				<input
					type='text'
					name='url'
					placeholder='Enter website url...'
					onChange={e => setUrlInput(e.target.value)}
					className='w-64 px-4 py-1 mt-4 leading-normal bg-white border border-gray-300 rounded-lg appearance-none focus:outline-none focus:shadow-outline'
				/>
				<button className='px-4 py-1 ml-1 border rounded-lg focus:outline-none focus:shadow-outline'>
					Search
				</button>
			</form>

			{isHttpError && <h3>Error getting data from website</h3>}

			{website && !isLoadingHeaders && !isHttpError && (
				<div className='mt-4'>
					<h3>Website: {website}</h3>
					<p>
						Number of posts:{' '}
						{response && parseInt(response.headers['x-wp-total'])}
					</p>
				</div>
			)}
			{website && !isLoadingHeaders && !isHttpError && posts.length > 0 ? (
				<>
					<Stats posts={posts} />
					<PostTable posts={posts} />
				</>
			) : (
				website && !isHttpError && <h5>Loading posts...</h5>
			)}
		</div>
	);
}

export default App;
