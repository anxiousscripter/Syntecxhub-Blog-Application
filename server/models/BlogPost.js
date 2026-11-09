
import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Blog title is required'],
            trim: true,
            maxlength: [150, 'Title cannot exceed 150 characters']
        },

        content: {
            type: String,
            required: [true, 'Blog content is required']
        },

        excerpt: {
            type: String,
            trim: true,
            maxlength: [300, 'Excerpt cannot exceed 300 characters']
        },

        featuredImage: {
            type: String,
            default: ''
        },

        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },

        status: {
            type: String,
            enum: ['draft', 'published'],
            default: 'draft'
        },

        publishedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

export default BlogPost;
