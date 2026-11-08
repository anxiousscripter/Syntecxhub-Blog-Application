import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './config/db.js';

// Load environment variables
dotenv.config();

// Initialize Express
const app = express();

// Middleware
app.use(
	cors({
		origin: process.env.CLIENT_URL,
	}),
);

app.use(express.json());

// Test route
app.get('/api/health', (req, res) => {
	res.status(200).json({
		success: true,
		message: 'Blog API is running!',
	});
});

// Start server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
	try {
		await connectDB();

		app.listen(PORT, () => {
			console.log(`Server running on port ${PORT}`);
		});
	} catch (error) {
		console.error('Failed to start server:', error.message);
		process.exit(1);
	}
};

startServer();
