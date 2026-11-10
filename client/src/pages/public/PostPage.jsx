import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import './PostPage.css';

function PostPage() {
	const { postId } = useParams();

	const [post, setPost] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		let ignore = false;

		const fetchPost = async () => {
			try {
				setLoading(true);
				setError('');

				const response = await api.get(`/posts/${postId}`);

				if (!ignore) {
					setPost(response.data.post);
				}
			} catch (error) {
				if (!ignore) {
					if (error.response?.status === 404) {
						setError('This article could not be found.');
					} else {
						setError(
							'Unable to load this article. Please try again.',
						);
					}
				}
			} finally {
				if (!ignore) {
					setLoading(false);
				}
			}
		};

		fetchPost();

		return () => {
			ignore = true;
		};
	}, [postId]);

	const getImageUrl = (imagePath) => {
		if (!imagePath) return '';

		if (imagePath.startsWith('http')) {
			return imagePath;
		}

		return `http://localhost:5000${imagePath}`;
	};

	const formatDate = (date) => {
		if (!date) return '';

		return new Date(date).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		});
	};

	if (loading) {
		return (
			<main className="post-page-message">
				<p>Loading article...</p>
			</main>
		);
	}

	if (error || !post) {
		return (
			<main className="post-page-message">
				<h2>{error || 'Article not found.'}</h2>
				<Link to="/">Return to homepage</Link>
			</main>
		);
	}

	return (
		<main className="post-page">
			<Link to="/" className="back-to-home">
				← Back to articles
			</Link>

			<article className="full-post">
				<header className="full-post-header">
					<p className="full-post-date">
						{formatDate(post.publishedAt)}
					</p>

					<h1>{post.title}</h1>

					{post.author?.name && (
						<p className="full-post-author">
							Written by {post.author.name}
						</p>
					)}
				</header>

				{post.featuredImage && (
					<img
						src={getImageUrl(post.featuredImage)}
						alt={post.title}
						className="full-post-image"
					/>
				)}

				<div
					className="full-post-content"
					dangerouslySetInnerHTML={{ __html: post.content }}
				/>
			</article>
		</main>
	);
}

export default PostPage;
