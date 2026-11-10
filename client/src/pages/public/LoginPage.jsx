import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AuthPage.css';

function LoginPage() {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError('');

		try {
			setLoading(true);

			await login({ email, password });

			navigate('/dashboard/posts');
		} catch (err) {
			console.error('Login error:', err);
			console.error('Server response:', err.response?.data);

			setError(
				err.response?.data?.message ||
					'Unable to log in. Please check your details.',
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="auth-page">
			<div className="auth-card">
				<h1>Welcome back</h1>
				<p>Sign in to manage your blog posts.</p>

				{error && (
					<p className="form-error" role="alert">
						{error}
					</p>
				)}

				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="email">Email address</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(event) => setEmail(event.target.value)}
							required
						/>
					</div>

					<div className="form-group">
						<label htmlFor="password">Password</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(event) =>
								setPassword(event.target.value)
							}
							required
						/>
					</div>

					<button type="submit" disabled={loading}>
						{loading ? 'Signing in...' : 'Sign in'}
					</button>
				</form>

				<p className="auth-switch">
					Don't have an account? <Link to="/register">Register</Link>
				</p>
			</div>
		</main>
	);
}

export default LoginPage;
