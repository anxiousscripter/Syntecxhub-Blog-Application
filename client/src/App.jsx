import { Routes, Route, Navigate } from 'react-router-dom';

import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

import CreatePostPage from './pages/dashboard/CreatePostPage';
import PlaceholderPage from './components/PlaceholderPage';

function App() {
	return (
		<Routes>
			{/* Public website */}
			<Route element={<PublicLayout />}>
				<Route
					path="/"
					element={
						<PlaceholderPage
							title="Welcome to MyBlog"
							description="Discover articles, ideas and stories."
						/>
					}
				/>

				<Route
					path="/posts/:postId"
					element={
						<PlaceholderPage
							title="Blog post"
							description="The individual blog post will appear here."
						/>
					}
				/>

				<Route
					path="/login"
					element={
						<PlaceholderPage
							title="Login"
							description="Sign in to your account."
						/>
					}
				/>

				<Route
					path="/register"
					element={
						<PlaceholderPage
							title="Create an account"
							description="Register to start writing blog posts."
						/>
					}
				/>
			</Route>

			{/* Dashboard */}
			<Route path="/dashboard" element={<DashboardLayout />}>
				<Route index element={<Navigate to="posts" replace />} />

				<Route
					path="posts"
					element={
						<PlaceholderPage
							title="Manage blog posts"
							description="View and manage your published posts and drafts."
						/>
					}
				/>

				<Route path="create" element={<CreatePostPage />} />

				<Route
					path="posts/:postId/edit"
					element={
						<PlaceholderPage
							title="Edit blog post"
							description="Edit an existing blog post."
						/>
					}
				/>
			</Route>

			{/* Unknown routes */}
			<Route
				path="*"
				element={
					<PlaceholderPage
						title="404 - Page not found"
						description="The page you're looking for doesn't exist."
					/>
				}
			/>
		</Routes>
	);
}

export default App;
