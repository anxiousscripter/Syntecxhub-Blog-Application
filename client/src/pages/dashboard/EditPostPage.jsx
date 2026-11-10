import './EditPostPage.css';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import api from '../../services/api';
import RichTextEditor from '../../components/editor/RichTextEditor';

function EditPostPage() {
	const { postId } = useParams();
	const navigate = useNavigate();

	const [title, setTitle] = useState('');
	const [excerpt, setExcerpt] = useState('');
	const [content, setContent] = useState('');
	const [featuredImage, setFeaturedImage] = useState(null);
	const [existingImage, setExistingImage] = useState('');
	const [status, setStatus] = useState('draft');

	const [preview, setPreview] = useState('');
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');

	// Fetch the existing post
	useEffect(() => {
		const fetchPost = async () => {
			try {
				setLoading(true);
				setError('');

				const response = await api.get(`/posts/my-posts/${postId}`);

				const post = response.data.post;

				setTitle(post.title || '');
				setExcerpt(post.excerpt || '');
				setContent(post.content || '');
				setExistingImage(post.featuredImage || '');
				setStatus(post.status || 'draft');
			} catch (err) {
				setError(
					err.response?.data?.message ||
						'Unable to load this blog post. Please try again.',
				);
			} finally {
				setLoading(false);
			}
		};

		fetchPost();
	}, [postId]);

	// Create and clean up the selected image preview URL
	useEffect(() => {
		if (!featuredImage) {
			setPreview('');
			return;
		}

		const imageUrl = URL.createObjectURL(featuredImage);
		setPreview(imageUrl);

		return () => URL.revokeObjectURL(imageUrl);
	}, [featuredImage]);

	const handleImageChange = (event) => {
		const file = event.target.files[0];

		if (!file) return;

		const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

		if (!allowedTypes.includes(file.type)) {
			setError('Please select a JPEG, PNG or WebP image.');
			event.target.value = '';
			return;
		}

		if (file.size > 5 * 1024 * 1024) {
			setError('The image must not exceed 5 MB.');
			event.target.value = '';
			return;
		}

		setError('');
		setFeaturedImage(file);
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError('');

		if (!title.trim()) {
			setError('Please enter a post title.');
			return;
		}

		if (!content.replace(/<[^>]*>/g, '').trim()) {
			setError('Please enter some blog content.');
			return;
		}

		const formData = new FormData();

		formData.append('title', title);
		formData.append('excerpt', excerpt);
		formData.append('content', content);
		formData.append('status', status);

		// Only send a file if the user selected a replacement.
		if (featuredImage) {
			formData.append('featuredImage', featuredImage);
		}

		try {
			setSaving(true);

			await api.put(`/posts/${postId}`, formData);

			navigate('/dashboard/posts');
		} catch (err) {
			setError(
				err.response?.data?.message ||
					'Unable to update your blog post. Please try again.',
			);
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<main className="edit-post-page">
				<p>Loading blog post...</p>
			</main>
		);
	}

	return (
		<main className="edit-post-page">
			<header className="edit-post-header">
				<h1>Edit blog post</h1>
				<Link to="/dashboard/posts">Back to posts</Link>
			</header>

			{error && (
				<p role="alert" className="form-error">
					{error}
				</p>
			)}

			<form onSubmit={handleSubmit}>
				<div className="form-group">
					<label htmlFor="title">Post title</label>
					<input
						id="title"
						type="text"
						value={title}
						onChange={(event) => setTitle(event.target.value)}
						maxLength={150}
						required
					/>
				</div>

				<div className="form-group">
					<label htmlFor="excerpt">Excerpt</label>
					<textarea
						id="excerpt"
						value={excerpt}
						onChange={(event) => setExcerpt(event.target.value)}
						maxLength={300}
						rows={3}
						placeholder="A short introduction to your post..."
					/>
				</div>

				<div className="form-group">
					<label htmlFor="featuredImage">Featured image</label>

					<input
						id="featuredImage"
						type="file"
						accept="image/jpeg,image/png,image/webp"
						onChange={handleImageChange}
					/>

					{preview ? (
						<img
							src={preview}
							alt="New featured image preview"
							className="edit-image-preview"
						/>
					) : existingImage ? (
						<div className="current-image">
							<p>Current featured image:</p>
							<img
								src={`http://localhost:5000${existingImage}`}
								alt="Current featured image"
								className="edit-image-preview"
							/>
						</div>
					) : (
						<p className="no-featured-image">
							No featured image selected.
						</p>
					)}
				</div>

				<div className="form-group">
					<label>Blog content</label>
					<RichTextEditor value={content} onChange={setContent} />
				</div>

				<div className="form-group">
					<label htmlFor="status">Publication status</label>

					<select
						id="status"
						value={status}
						onChange={(event) => setStatus(event.target.value)}>
						<option value="draft">Save as draft</option>
						<option value="published">Publish</option>
					</select>
				</div>

				<button type="submit" disabled={saving}>
					{saving ? 'Saving changes...' : 'Save changes'}
				</button>
			</form>
		</main>
	);
}

export default EditPostPage;
