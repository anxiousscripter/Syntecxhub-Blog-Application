import multer from 'multer';
import path from 'path';
import { randomUUID } from 'crypto';

// Configure where uploaded images will be stored
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},

	filename: (req, file, cb) => {
		const extensions = {
			'image/jpeg': '.jpg',
			'image/png': '.png',
			'image/webp': '.webp',
		};

		const extension = extensions[file.mimetype];

		cb(null, `${randomUUID()}${extension}`);
	},
});

// Validate uploaded files
const fileFilter = (req, file, cb) => {
	const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

	if (allowedTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error('Only JPEG, PNG and WebP images are allowed.'));
	}
};

// Configure Multer
const upload = multer({
	storage,
	fileFilter,
	limits: {
		fileSize: 5 * 1024 * 1024,
	},
});

// Handle upload errors
export const uploadFeaturedImage = (req, res, next) => {
	upload.single('featuredImage')(req, res, (error) => {
		if (error instanceof multer.MulterError) {
			const message =
				error.code === 'LIMIT_FILE_SIZE'
					? 'Image must not exceed 5 MB.'
					: error.message;

			return res.status(400).json({
				success: false,
				message,
			});
		}

		if (error) {
			return res.status(400).json({
				success: false,
				message: error.message,
			});
		}

		next();
	});
};
