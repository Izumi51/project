import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router';
import { useAuth } from '../hooks/auth/useAuth';

const Register = () => {
	// --- State Management ---
	// Store the user's input for all fields
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');

	// Store client-side validation errors (from your old file)
	const [nameError, setNameError] = useState('');
	const [emailError, setEmailError] = useState('');
	const [passwordError, setPasswordError] = useState('');
	const [confirmPasswordError, setConfirmPasswordError] = useState('');

	// Store general/server errors (e.g., "Email already in use")
	const [error, setError] = useState(null);
	
	// Track loading state
	const [isLoading, setIsLoading] = useState(false);

	// --- React Router & Auth Context ---
	const { register, isAuthenticated } = useAuth();
	const navigate = useNavigate();

	// --- Client-Side Validation (Adapted from your old file) ---
	const validateInputs = () => {
		// Clear all previous client-side errors
		setNameError('');
		setEmailError('');
		setPasswordError('');
		setConfirmPasswordError('');
		let isValid = true;

		// 1. Name Validation
		if (!name.trim()) {
			setNameError('Nome é obrigatório');
			isValid = false;
		} else if (name.length < 3) {
			setNameError('Nome deve ter pelo menos 3 caracteres');
			isValid = false;
		}

		// 2. Email Validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email.trim()) {
			setEmailError('Email é obrigatório');
			isValid = false;
		} else if (!emailRegex.test(email)) {
			setEmailError('Email inválido');
			isValid = false;
		}

		// 3. Password Validation (Using your strong rules)
		if (!password.trim()) {
			setPasswordError('Senha é obrigatória');
			isValid = false;
		} else {
			if (password.length < 8) {
				setPasswordError('Senha deve ter pelo menos 8 caracteres.');
				isValid = false;
			}
			// You can add more rules back if you want
			// if (!/[A-Z]/.test(password)) { ... }
			// if (!/\d/.test(password)) { ... }
			// if (!/[\W_]/.test(password)) { ... }
		}

		// 4. Confirm Password Validation
		if (password !== confirmPassword) {
			setConfirmPasswordError('As senhas não coincidem');
			isValid = false;
		}

		return isValid;
	};

	// --- Form Submission Handler ---
	const handleSubmit = async (e) => {
		e.preventDefault();
		
		// Clear any previous server errors
		setError(null);

		// 1. Run client-side validation
		if (!validateInputs()) {
			return; // Stop submission if validation fails
		}

		// 2. If validation passes, attempt registration
		setIsLoading(true);

		try {
			// Call the register function from AuthProvider
			await register(email, password, name);
			
			// On success, AuthProvider already logs the user in.
			// Just navigate to the homepage.
			navigate('/');
			
		} catch (err) {
			// If register fails (e.g., "Email already in use"), set the error
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	// --- Authentication Check ---
	// If the user is already authenticated, redirect them.
	if (isAuthenticated) {
		return <Navigate to="/" replace />;
	}

	return (
		// Centering the card, rendered inside MainLayout's gray background
		<div className="flex items-center justify-center py-12">
			
			{/* Form Card: White background, styled to match Login.jsx */}
			<div className="mx-auto w-full max-w-md bg-[#FFFFFF] rounded-lg shadow-md p-8">
				
				<h2 className="text-3xl font-bold text-center text-gray-900 mb-6">
					Cadastre-se
				</h2>
				
				{/* Display Server Error (e.g., "Email em uso") */}
				{error && (
					<div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center" role="alert">
						{error}
					</div>
				)}

				<form onSubmit={handleSubmit} className="space-y-4" noValidate>
					
					{/* Name Field */}
					<div>
						<label 
							htmlFor="name" 
							className="block text-sm font-medium text-gray-700"
						>
							Nome
						</label>
						<input
							id="name"
							type="text"
							autoComplete="name"
							required
							value={name}
							// Clear error on change (from your old file)
							onChange={(e) => { setName(e.target.value); setNameError(''); }}
							// Apply error border if nameError exists
							className={`mt-1 block w-full px-3 py-2 border ${nameError ? 'border-red-500' : 'border-[#CBCBCB]'} rounded-md shadow-sm focus:outline-none focus:ring-[#777C6D] focus:border-[#777C6D] sm:text-sm`}
						/>
						{/* Display Client-Side Name Error */}
						{nameError && (
							<p className="mt-1 text-xs text-red-600">{nameError}</p>
						)}
					</div>

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
							onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
							className={`mt-1 block w-full px-3 py-2 border ${emailError ? 'border-red-500' : 'border-[#CBCBCB]'} rounded-md shadow-sm focus:outline-none focus:ring-[#777C6D] focus:border-[#777C6D] sm:text-sm`}
						/>
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
							autoComplete="new-password"
							required
							value={password}
							onChange={(e) => { setPassword(e.target.value); setPasswordError(''); }}
							className={`mt-1 block w-full px-3 py-2 border ${passwordError ? 'border-red-500' : 'border-[#CBCBCB]'} rounded-md shadow-sm focus:outline-none focus:ring-[#777C6D] focus:border-[#777C6D] sm:text-sm`}
						/>
						{passwordError && (
							<p className="mt-1 text-xs text-red-600">{passwordError}</p>
						)}
					</div>

					{/* Confirm Password Field */}
					<div>
						<label 
							htmlFor="confirmPassword" 
							className="block text-sm font-medium text-gray-700"
						>
							Confirmar Senha
						</label>
						<input
							id="confirmPassword"
							type="password"
							autoComplete="new-password"
							required
							value={confirmPassword}
							onChange={(e) => { setConfirmPassword(e.target.value); setConfirmPasswordError(''); }}
							className={`mt-1 block w-full px-3 py-2 border ${confirmPasswordError ? 'border-red-500' : 'border-[#CBCBCB]'} rounded-md shadow-sm focus:outline-none focus:ring-[#777C6D] focus:border-[#777C6D] sm:text-sm`}
						/>
						{confirmPasswordError && (
							<p className="mt-1 text-xs text-red-600">{confirmPasswordError}</p>
						)}
					</div>

					{/* Submit Button */}
					<div className="pt-2">
						<button
							type="submit"
							disabled={isLoading}
							// Button style from your new project's theme
							className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#777C6D] hover:bg-[#5f6356] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#777C6D] disabled:opacity-50"
						>
							{isLoading ? 'Criando conta...' : 'Cadastrar'}
						</button>
					</div>
					
					{/* Sign In Link (from your old file, styled to match) */}
					<p className="text-center text-sm text-gray-600 pt-2">
						Já tem uma conta?{' '}
						<Link 
							to="/login" 
							className="font-medium text-[#777C6D] hover:text-[#5f6356] hover:underline"
						>
							Entrar
						</Link>
					</p>

				</form>
			</div>
		</div>
	);
};

export default Register;