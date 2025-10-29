import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'

//Components
import AppProviders from './context/AppProvider.jsx'
import MainLayout from './components/MainLayout.jsx';
import ProtectedRoutes from './components/ProtectedRoutes.jsx';

//Pages
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Bidding from './pages/Bidding.jsx'
import Product from './pages/Product.jsx'
import Supplier from './pages/Supplier.jsx'
import Match from './pages/Match.jsx'
import NotFound from './pages/Notfound.jsx';
import Register from './pages/Register.jsx';
// import ForgotPassword from './pages/ForgotPassword.jsx';
// import ProductDetails from './pages/ProductDetails.jsx';
// import User from './pages/User.jsx'; // (Profile)
// import OtpDemo from './pages/OtpDemo.jsx';

const router = createBrowserRouter([
	{
		path: "/",
		element: <MainLayout />, // <-- Main Layout
		errorElement: <NotFound />, // <-- Error Page for all routes
		children: [
			// --- Public Routes ---
			{
				index: true, // path: "/"
				element: <Home />,
			},

			{
				path: "/login",
				element: <Login />,
			},

			{
				path: "/register",
				element: <Register />,
			},

			// {
			// 	path: "/forgot-password",
			// 	element: <ForgotPassword />,
			// },

			// {
			// 	path: "/products/:id",
			// 	element: <ProductDetails />,
			// },

			// --- Protected Routes ---
			// --- All routes here will need to be looged ---
			{
				element: <ProtectedRoutes />,
				children: [
					// {
					// 	path: "/profile",
					// 	element: <User />,
					// },

					{
						path: "/supplier",
						element: <Supplier />,
					},

					{
						path: "/product",
						element: <Product />,
					},

					{
						path: "/bidding",
						element: <Bidding />,
					},

					{
						path: "/match",
						element: <Match />,
					},
				],
			},
		],
	},

	{
		path: "*", 
		element: <NotFound /> 
	}
]);

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<AppProviders>
			<RouterProvider router={router} />
		</AppProviders>
	</StrictMode>,
)