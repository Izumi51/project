import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router';
import { useAuth } from '../hooks/auth/useAuth';

const Login = () => {
	// --- State Management ---
	// Store the user's input
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	
	// Store specific validation errors (from old file)
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	
	// Store general/server errors (from new file)
	const [error, setError] = useState(null);
	
	// Track loading state
	const [isLoading, setIsLoading] = useState(false);

	// --- React Router & Auth Context ---
	const { login, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	// --- Client-Side Validation ---
	// This provides a better UX by checking inputs before sending to the server.
	const validateInputs = () => {
		// Clear previous errors
		setEmailError('');
		setPasswordError('');
		let isValid = true;

		// 1. Validate Email
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email.trim()) {
			setEmailError('Email é obrigatório');
			isValid = false;
		} else if (!emailRegex.test(email)) {
			setEmailError('Email inválido');
			isValid = false;
		}

		// 2. Validate Password
		if (!password.trim()) {
			setPasswordError('Senha é obrigatória');
			isValid = false;
		} else if (password.length < 6) {
			// You can adjust this rule if needed
			setPasswordError('Senha deve ter pelo menos 6 caracteres');
			isValid = false;
		}

		return isValid;
	};

	// --- Form Submission Handler ---
	const handleSubmit = async (e) => {
		// Prevent the default form submission (which reloads the page)
		e.preventDefault();
		
		// Clear server error
		setError(null);

		// 1. Run client-side validation first
		if (!validateInputs()) {
			return; // Stop if validation fails
		}

		// 2. If validation passes, proceed to login
		setIsLoading(true);

		try {
			// Attempt to log in (this will throw an error on failure,
			// as per your new AuthProvider)
			await login(email, password);
			
			// On success, navigate to the homepage
			navigate('/');
			
		} catch (err) {
			// If login fails, set the server error message
			setError(err.message);
		} finally {
			// Always stop loading, whether success or fail
			setIsLoading(false);
		}
	};

	// --- Authentication Check ---
	// If the user is already authenticated, redirect them.
	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	return (
		// This component renders inside MainLayout, which provides the light gray bg.
		// We center the form card on the screen.
		<div className="flex items-center justify-center py-12">
			
			{/* Form Card
				- Background: #FFFFFF (White)
				- Styled to match your project's theme
			*/}
			<div className="mx-auto w-full max-w-md bg-[#FFFFFF] rounded-lg shadow-md p-8">
				
				<h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
					Login
				</h2>
				
				{/* Display Server Error (e.g., "Invalid Credentials") */}
				{error && (
					<div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center" role="alert">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-5" noValidate>
					
					{/* Email Field */}
					<div>
						<label 
							htmlFor="email" 
							className="block text-sm font-medium text-gray-700"
						>
							Email
						</label>
						<input
							id="email"
							type="email"
							autoComplete="email"
							required
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							// Input border color: #CBCBCB (Light Gray)
							// Focus ring color: #777C6D (Dark Olive/Gray)
							className={`mt-1 block w-full px-3 py-2 border ${emailError ? 'border-red-500' : 'border-[#CBCBCB]'} rounded-md shadow-sm focus:outline-none focus:ring-[#777C6D] focus:border-[#777C6D] sm:text-sm`}
						/>
						{/* Display Client-Side Email Error */}
						{emailError && (
							<p className="mt-1 text-xs text-red-600">{emailError}</p>
						)}
					</div>

					{/* Password Field */}
					<div>
						<label 
							htmlFor="password" 
							className="block text-sm font-medium text-gray-700"
						>
							Senha
						</label>
						<input
							id="password"
							type="password"
							autoComplete="current-password"
							required
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							// Styles match the email input
							className={`mt-1 block w-full px-3 py-2 border ${passwordError ? 'border-red-500' : 'border-[#CBCBCB]'} rounded-md shadow-sm focus:outline-none focus:ring-[#777C6D] focus:border-[#777C6D] sm:text-sm`}
						/>
						{/* Display Client-Side Password Error */}
						{passwordError && (
							<p className="mt-1 text-xs text-red-600">{passwordError}</p>
						)}
					</div>

					{/* Submit Button */}
					<div>
						<button
							type="submit"
							disabled={isLoading}
							// Button background color: #777C6D (Dark Olive/Gray)
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#777C6D] hover:bg-[#5f6356] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#777C6D] disabled:opacity-50"
						>
							{isLoading ? 'Entrando...' : 'Entrar'}
						</button>
					</div>

					{/* Links
					<div className="text-sm text-center">
						 NOTE: The "/forgot-password" route is commented out in main.jsx.
						     You will need to uncomment it there for this link to work. 
						<Link 
							to="/forgot-password"
							className="font-medium text-[#777C6D] hover:text-[#5f6356] hover:underline"
						>
							Esqueceu sua senha?
						</Link>
					</div> */}
					
					{/* Divider */}
					<div className="relative my-4">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-[#CBCBCB]"></span>
						</div>
						<div className="relative flex justify-center text-sm">
							<span className="px-2 bg-white text-gray-500">ou</span>
						</div>
					</div>

					{/* Sign Up Link */}
					<p className="text-center text-sm text-gray-600">
						Não tem uma conta?{' '}
						<Link 
							to="/register" 
							className="font-medium text-[#777C6D] hover:text-[#5f6356] hover:underline"
						>
							Cadastre-se
						</Link>
					</p> 

				</form>
			</div>
		</div>
	);
};

export default Login;