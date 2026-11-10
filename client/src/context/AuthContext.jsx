import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null);
	const [authLoading, setAuthLoading] = useState(true);

	// Check whether the browser already has a valid login cookie.
	useEffect(() => {
		const checkAuth = async () => {
			try {
				const response = await api.get('/auth/me');
				setUser(response.data.user);
			} catch {
				setUser(null);
			} finally {
				setAuthLoading(false);
			}
		};

		checkAuth();
	}, []);

	const login = async (credentials) => {
		const response = await api.post('/auth/login', credentials);
		setUser(response.data.user);
		return response.data;
	};

	const register = async (userDetails) => {
		const response = await api.post('/auth/register', userDetails);
		setUser(response.data.user);
		return response.data;
	};

	const logout = async () => {
		try {
			await api.post('/auth/logout');
		} finally {
			setUser(null);
		}
	};

	const value = {
		user,
		authLoading,
		isAuthenticated: Boolean(user),
		login,
		register,
		logout,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);

	if (!context) {
		throw new Error('useAuth must be used within an AuthProvider');
	}

	return context;
}
