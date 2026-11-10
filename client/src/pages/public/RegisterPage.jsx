import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AuthPage.css';

function RegisterPage() {
	const navigate = useNavigate();
	const { register } = useAuth();

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setError('');

		if (password !== confirmPassword) {
			setError('Your passwords do not match.');
			return;
		}

		try {
			setLoading(true);

			await register({ name, email, password });

			navigate('/dashboard/posts');
		} catch (err) {
			console.error('Registration error:', err);
			console.error('Server response:', err.response?.data);

			setError(
				err.response?.data?.message ||
					'Unable to create your account. Please try again.',
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<main className="auth-page">
			<div className="auth-card">
				<h1>Create an account</h1>
				<p>Join us and start sharing your stories.</p>

				{error && (
					<p className="form-error" role="alert">
						{error}
					</p>
				)}

				<form onSubmit={handleSubmit}>
					<div className="form-group">
						<label htmlFor="name">Full name</label>
						<input
							id="name"
							type="text"
							value={name}
							onChange={(event) => setName(event.target.value)}
							required
						/>
					</div>

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

					<div className="form-group">
						<label htmlFor="confirmPassword">
							Confirm password
						</label>
						<input
							id="confirmPassword"
							type="password"
							value={confirmPassword}
							onChange={(event) =>
								setConfirmPassword(event.target.value)
							}
							required
						/>
					</div>

					<button type="submit" disabled={loading}>
						{loading ? 'Creating account...' : 'Create account'}
					</button>
				</form>

				<p className="auth-switch">
					Already have an account? <Link to="/login">Sign in</Link>
				</p>
			</div>
		</main>
	);
}

export default RegisterPage;
