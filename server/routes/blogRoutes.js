import express from 'express';

import {
	getPublishedPosts,
	getPublishedPost,
	getMyPosts,
	getMyPost,
	createPost,
	updatePost,
	deletePost,
} from '../controllers/blogController.js';

import { protect } from '../middleware/authMiddleware.js';
import { uploadFeaturedImage } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getPublishedPosts);

// Protected routes
router.get('/my-posts', protect, getMyPosts);
router.get('/my-posts/:postId', protect, getMyPost);

router.post('/', protect, uploadFeaturedImage, createPost);
router.put('/:postId', protect, uploadFeaturedImage, updatePost);
router.delete('/:postId', protect, deletePost);

// Individual public post
router.get('/:postId', getPublishedPost);

export default router;
