import './layouts.css';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function DashboardLayout() {
	const { logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			await logout();
			navigate('/login');
		} catch (error) {
			console.error('Logout error:', error);
		}
	};

	return (
		<div className="dashboard-layout">
			<aside className="dashboard-sidebar">
				<h2>MyBlog Admin</h2>

				<nav>
					<Link to="/dashboard/posts">Manage posts</Link>
					<Link to="/dashboard/create">Create post</Link>
					<Link to="/">View website</Link>
				</nav>

				<button
					type="button"
					className="logout-button"
					onClick={handleLogout}>
					Log out
				</button>
			</aside>

			<main className="dashboard-content">
				<Outlet />
			</main>
		</div>
	);
}

export default DashboardLayout;
