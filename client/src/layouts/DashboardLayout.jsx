import './layouts.css';
import { Link, Outlet } from 'react-router-dom';

function DashboardLayout() {
	return (
		<div className="dashboard-layout">
			<aside className="dashboard-sidebar">
				<h2>MyBlog Admin</h2>

				<nav>
					<Link to="/dashboard/posts">Manage posts</Link>
					<Link to="/dashboard/create">Create post</Link>
					<Link to="/">View website</Link>
				</nav>
			</aside>

			<main className="dashboard-content">
				<Outlet />
			</main>
		</div>
	);
}

export default DashboardLayout;
