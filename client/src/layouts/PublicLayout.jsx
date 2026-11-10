import './layouts.css';
import { Link, Outlet } from 'react-router-dom';

function PublicLayout() {
	return (
		<>
			<header className="public-header">
				<nav>
					<Link to="/" className="site-logo">
						MyBlog
					</Link>

					<div className="public-nav-links">
						<Link to="/">Home</Link>
						<Link to="/login">Login</Link>
						<Link to="/register">Register</Link>
						<Link to="/dashboard/posts">Dashboard</Link>
					</div>
				</nav>
			</header>

			<Outlet />

			<footer className="public-footer">
				<p>© {new Date().getFullYear()} MyBlog. All rights reserved.</p>
			</footer>
		</>
	);
}

export default PublicLayout;
