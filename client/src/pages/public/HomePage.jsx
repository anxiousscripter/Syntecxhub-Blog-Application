import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './HomePage.css';

const POSTS_PER_PAGE = 6;

function HomePage() {
	const [posts, setPosts] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');
	const [retry, setRetry] = useState(0);

	useEffect(() => {
		let ignore = false;

		const fetchPosts = async () => {
			try {
				setLoading(true);
				setError('');

				const response = await api.get(
					`/posts?page=${currentPage}&limit=${POSTS_PER_PAGE}`,
				);

				if (ignore) return;

				const fetchedPosts = response.data.posts || [];
				const pagination = response.data.pagination;

				setPosts(fetchedPosts);
				setTotalPages(pagination?.totalPages || 1);
			} catch (error) {
				if (!ignore) {
					setError(
						error.response?.data?.message ||
							'Unable to load blog posts. Please try again.',
					);
				}
			} finally {
				if (!ignore) {
					setLoading(false);
				}
			}
		};

		fetchPosts();

		return () => {
			ignore = true;
		};
	}, [currentPage, retry]);

	const getImageUrl = (imagePath) => {
		if (!imagePath) return '';

		if (imagePath.startsWith('http')) {
			return imagePath;
		}

		return `http://localhost:5000${imagePath}`;
	};

	const getExcerpt = (post) => {
		if (post.excerpt) {
			return post.excerpt;
		}

		return (
			post.content?.replace(/<[^>]*>/g, '').slice(0, 160) ||
			'Read this article to learn more.'
		);
	};

	const formatDate = (date) => {
		if (!date) return '';

		return new Date(date).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	return (
		<main className="home-page">
			<section className="home-hero">
				<p className="hero-eyebrow">WELCOME TO MYBLOG</p>
				<h1>Ideas, stories and perspectives.</h1>
				<p>
					Discover articles, explore new ideas and read stories from
					our community.
				</p>
			</section>

			<section className="articles-section">
				<div className="section-heading">
					<div>
						<p className="section-eyebrow">THE LATEST</p>
						<h2>Recent articles</h2>
					</div>
				</div>

				{loading && (
					<p className="posts-message">Loading articles...</p>
				)}

				{error && (
					<div className="posts-message error-message">
						<p>{error}</p>
						<button
							type="button"
							onClick={() => setRetry((value) => value + 1)}>
							Try again
						</button>
					</div>
				)}

				{!loading && !error && posts.length === 0 && (
					<p className="posts-message">
						There are no published articles yet. Please check back
						later.
					</p>
				)}

				{!loading && !error && posts.length > 0 && (
					<>
						<div className="posts-grid">
							{posts.map((post) => (
								<article className="post-card" key={post._id}>
									<Link
										to={`/posts/${post._id}`}
										className="post-image-link">
										{post.featuredImage ? (
											<img
												src={getImageUrl(
													post.featuredImage,
												)}
												alt={post.title}
												className="post-card-image"
											/>
										) : (
											<div className="post-image-placeholder">
												<span>MyBlog</span>
											</div>
										)}
									</Link>

									<div className="post-card-content">
										<p className="post-date">
											{formatDate(post.publishedAt)}
										</p>

										<h3>
											<Link to={`/posts/${post._id}`}>
												{post.title}
											</Link>
										</h3>

										<p className="post-excerpt">
											{getExcerpt(post)}
										</p>

										<Link
											to={`/posts/${post._id}`}
											className="read-more-link">
											Read article →
										</Link>
									</div>
								</article>
							))}
						</div>

						{totalPages > 1 && (
							<div className="pagination">
								<button
									type="button"
									onClick={() =>
										setCurrentPage((page) => page - 1)
									}
									disabled={currentPage === 1}>
									Previous
								</button>

								<span>
									Page {currentPage} of {totalPages}
								</span>

								<button
									type="button"
									onClick={() =>
										setCurrentPage((page) => page + 1)
									}
									disabled={currentPage === totalPages}>
									Next
								</button>
							</div>
						)}
					</>
				)}
			</section>
		</main>
	);
}

export default HomePage;
