import { Routes, Route, Navigate } from 'react-router-dom';

import PublicLayout from './layouts/PublicLayout';
import DashboardLayout from './layouts/DashboardLayout';

import ProtectedRoute from './components/ProtectedRoute';
import CreatePostPage from './pages/dashboard/CreatePostPage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import PlaceholderPage from './components/PlaceholderPage';
import ManagePostsPage from './pages/dashboard/ManagePostsPage';
import EditPostPage from './pages/dashboard/EditPostPage';
import HomePage from './pages/public/HomePage';

function App() {
	return (
		<Routes>
			{/* Public website */}
			<Route element={<PublicLayout />}>
				<Route path="/" element={<HomePage />} />

				<Route
					path="/posts/:postId"
					element={
						<PlaceholderPage
							title="Blog post"
							description="The individual blog post will appear here."
						/>
					}
				/>

				<Route path="/login" element={<LoginPage />} />
				<Route path="/register" element={<RegisterPage />} />
			</Route>

			{/* Protected dashboard */}
			<Route element={<ProtectedRoute />}>
				<Route path="/dashboard" element={<DashboardLayout />}>
					<Route index element={<Navigate to="posts" replace />} />

					<Route path="posts" element={<ManagePostsPage />} />

					<Route path="create" element={<CreatePostPage />} />

					<Route
						path="posts/:postId/edit"
						element={<EditPostPage />}
					/>
				</Route>
			</Route>

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
