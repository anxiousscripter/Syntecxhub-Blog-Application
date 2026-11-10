import mongoose from 'mongoose';
import BlogPost from '../models/BlogPost.js';
import sanitizeContent from '../utils/sanitizeContent.js';

// Check whether the user owns a post or is an admin
const canManagePost = (post, user) => {
	return post.author.equals(user._id) || user.role === 'admin';
};

// Validate MongoDB document ID
const isValidId = (id) => {
	return mongoose.isValidObjectId(id);
};

// Get all published posts (public)
export const getPublishedPosts = async (req, res) => {
	try {
		const page = Math.max(1, parseInt(req.query.page) || 1);
		const limit = Math.min(
			20,
			Math.max(1, parseInt(req.query.limit) || 10),
		);

		const skip = (page - 1) * limit;

		const [posts, totalPosts] = await Promise.all([
			BlogPost.find({ status: 'published' })
				.populate('author', 'name')
				.sort({ publishedAt: -1 })
				.skip(skip)
				.limit(limit),

			BlogPost.countDocuments({ status: 'published' }),
		]);

		return res.status(200).json({
			success: true,
			posts,
			pagination: {
				currentPage: page,
				totalPages: Math.ceil(totalPosts / limit),
				totalPosts,
				hasNextPage: page * limit < totalPosts,
				hasPrevPage: page > 1,
			},
		});
	} catch (error) {
		console.error('Get published posts error:', error);

		return res.status(500).json({
			success: false,
			message: 'Failed to retrieve blog posts.',
		});
	}
};

// Get one published post (public)
export const getPublishedPost = async (req, res) => {
	try {
		const { postId } = req.params;

		if (!isValidId(postId)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid blog post ID.',
			});
		}

		const post = await BlogPost.findOne({
			_id: postId,
			status: 'published',
		}).populate('author', 'name');

		if (!post) {
			return res.status(404).json({
				success: false,
				message: 'Blog post not found.',
			});
		}

		return res.status(200).json({
			success: true,
			post,
		});
	} catch (error) {
		console.error('Get published post error:', error);

		return res.status(500).json({
			success: false,
			message: 'Failed to retrieve blog post.',
		});
	}
};

// Get posts belonging to the authenticated user
// Admins can retrieve all posts
export const getMyPosts = async (req, res) => {
	try {
		const filter =
			req.user.role === 'admin' ? {} : { author: req.user._id };

		const posts = await BlogPost.find(filter)
			.populate('author', 'name')
			.sort({ updatedAt: -1 });

		return res.status(200).json({
			success: true,
			posts,
		});
	} catch (error) {
		console.error('Get my posts error:', error);

		return res.status(500).json({
			success: false,
			message: 'Failed to retrieve your blog posts.',
		});
	}
};

// Get a post for editing
export const getMyPost = async (req, res) => {
	try {
		const { postId } = req.params;

		if (!isValidId(postId)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid blog post ID.',
			});
		}

		const post = await BlogPost.findById(postId).populate('author', 'name');

		if (!post) {
			return res.status(404).json({
				success: false,
				message: 'Blog post not found.',
			});
		}

		if (!canManagePost(post, req.user)) {
			return res.status(403).json({
				success: false,
				message: 'You cannot access this blog post.',
			});
		}

		return res.status(200).json({
			success: true,
			post,
		});
	} catch (error) {
		console.error('Get editable post error:', error);

		return res.status(500).json({
			success: false,
			message: 'Failed to retrieve blog post.',
		});
	}
};

// Create a blog post

export const createPost = async (req, res) => {
	try {
		const { title, content, excerpt, status } = req.body;

		if (!title?.trim() || !content?.trim()) {
			return res.status(400).json({
				success: false,
				message: 'Title and content are required.',
			});
		}

		if (title.trim().length > 150) {
			return res.status(400).json({
				success: false,
				message: 'Title cannot exceed 150 characters.',
			});
		}

		if (excerpt && excerpt.length > 300) {
			return res.status(400).json({
				success: false,
				message: 'Excerpt cannot exceed 300 characters.',
			});
		}

		if (status && !['draft', 'published'].includes(status)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid post status.',
			});
		}

		const postStatus = status || 'draft';

		const post = await BlogPost.create({
			title: title.trim(),
			content: sanitizeContent(content),
			excerpt: excerpt?.trim() || '',
			featuredImage: req.file ? `/uploads/${req.file.filename}` : '',
			author: req.user._id,
			status: postStatus,
			publishedAt: postStatus === 'published' ? new Date() : null,
		});

		return res.status(201).json({
			success: true,
			message: 'Blog post created successfully.',
			post,
		});
	} catch (error) {
		console.error('Create post error:', error);

		return res.status(500).json({
			success: false,
			message: 'Failed to create blog post.',
		});
	}
};

// Update a blog post
export const updatePost = async (req, res) => {
	try {
		const { postId } = req.params;
		const { title, content, excerpt, status } = req.body;

		if (!isValidId(postId)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid blog post ID.',
			});
		}

		const post = await BlogPost.findById(postId);

		if (!post) {
			return res.status(404).json({
				success: false,
				message: 'Blog post not found.',
			});
		}

		if (!canManagePost(post, req.user)) {
			return res.status(403).json({
				success: false,
				message: 'You are not allowed to edit this post.',
			});
		}

		if (title !== undefined) {
			if (!title.trim() || title.trim().length > 150) {
				return res.status(400).json({
					success: false,
					message:
						'Please provide a valid title (maximum 150 characters).',
				});
			}

			post.title = title.trim();
		}

		if (content !== undefined) {
			if (!content.trim()) {
				return res.status(400).json({
					success: false,
					message: 'Content cannot be empty.',
				});
			}

			post.content = sanitizeContent(content);
		}

		if (excerpt !== undefined) {
			if (excerpt.length > 300) {
				return res.status(400).json({
					success: false,
					message: 'Excerpt cannot exceed 300 characters.',
				});
			}

			post.excerpt = excerpt.trim();
		}

		if (status !== undefined) {
			if (!['draft', 'published'].includes(status)) {
				return res.status(400).json({
					success: false,
					message: 'Invalid post status.',
				});
			}

			if (status === 'published' && post.status !== 'published') {
				post.publishedAt = new Date();
			}

			if (status === 'draft') {
				post.publishedAt = null;
			}

			post.status = status;
		}

		// Replace featured image if a new one was uploaded
		if (req.file) {
			post.featuredImage = `/uploads/${req.file.filename}`;
		}

		await post.save();

		return res.status(200).json({
			success: true,
			message: 'Blog post updated successfully.',
			post,
		});
	} catch (error) {
		console.error('Update post error:', error);

		return res.status(500).json({
			success: false,
			message: 'Failed to update blog post.',
		});
	}
};

// Delete a blog post
export const deletePost = async (req, res) => {
	try {
		const { postId } = req.params;

		if (!isValidId(postId)) {
			return res.status(400).json({
				success: false,
				message: 'Invalid blog post ID.',
			});
		}

		const post = await BlogPost.findById(postId);

		if (!post) {
			return res.status(404).json({
				success: false,
				message: 'Blog post not found.',
			});
		}

		if (!canManagePost(post, req.user)) {
			return res.status(403).json({
				success: false,
				message: 'You are not allowed to delete this post.',
			});
		}

		await post.deleteOne();

		return res.status(200).json({
			success: true,
			message: 'Blog post deleted successfully.',
		});
	} catch (error) {
		console.error('Delete post error:', error);

		return res.status(500).json({
			success: false,
			message: 'Failed to delete blog post.',
		});
	}
};
