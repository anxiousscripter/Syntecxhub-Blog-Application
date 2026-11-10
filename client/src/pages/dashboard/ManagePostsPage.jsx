import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './ManagePostsPage.css';

function ManagePostsPage() {
	const [posts, setPosts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState('');

	// Fetch the current user's posts
	const fetchPosts = async () => {
		try {
			setLoading(true);
			setError('');

			const response = await api.get('/posts/my-posts');

			setPosts(response.data.posts);
		} catch (err) {
			setError(
				err.response?.data?.message ||
					'Unable to load your posts. Please try again.',
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchPosts();
	}, []);

	// Delete a post
	const handleDelete = async (postId) => {
		const confirmed = window.confirm(
			'Are you sure you want to delete this post? This action cannot be undone.',
		);

		if (!confirmed) return;

		try {
			await api.delete(`/posts/${postId}`);

			setPosts((currentPosts) =>
				currentPosts.filter((post) => post._id !== postId),
			);
		} catch (err) {
			setError(
				err.response?.data?.message ||
					'Unable to delete this post. Please try again.',
			);
		}
	};

	// Loading state
	if (loading) {
		return (
			<div className="manage-posts-page">
				<p>Loading your posts...</p>
			</div>
		);
	}

	return (
		<div className="manage-posts-page">
			<header className="manage-posts-header">
				<div>
					<h1>Manage Posts</h1>
					<p>View and manage your blog posts.</p>
				</div>

				<Link to="/dashboard/create" className="create-post-button">
					Create New Post
				</Link>
			</header>

			{error && <div className="manage-posts-error">{error}</div>}

			{posts.length === 0 ? (
				<div className="empty-posts">
					<h2>No posts yet</h2>
					<p>
						You haven't created any blog posts. Start writing your
						first post!
					</p>

					<Link to="/dashboard/create">Create your first post</Link>
				</div>
			) : (
				<div className="posts-table-wrapper">
					<table className="posts-table">
						<thead>
							<tr>
								<th>Post</th>
								<th>Status</th>
								<th>Date</th>
								<th>Actions</th>
							</tr>
						</thead>

						<tbody>
							{posts.map((post) => (
								<tr key={post._id}>
									<td>
										<div className="post-title-cell">
											{post.featuredImage && (
												<img
													src={`http://localhost:5000${post.featuredImage}`}
													alt=""
													className="post-thumbnail"
												/>
											)}

											<span>{post.title}</span>
										</div>
									</td>

									<td>
										<span
											className={`post-status ${post.status}`}>
											{post.status}
										</span>
									</td>

									<td>
										{new Date(
											post.updatedAt,
										).toLocaleDateString()}
									</td>

									<td>
										<div className="post-actions">
											<Link
												to={`/dashboard/edit/${post._id}`}
												className="edit-post-button">
												Edit
											</Link>

											<button
												type="button"
												className="delete-post-button"
												onClick={() =>
													handleDelete(post._id)
												}>
												Delete
											</button>
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}
		</div>
	);
}

export default ManagePostsPage;
