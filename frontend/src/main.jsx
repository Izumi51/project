import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AppProviders } from './context/AppProvider.jsx'
import { createBrowserRouter, RouterProvider} from 'react-router'
//Components
import MainLayout from './components/MainLayout.jsx';
import { ProtectedRoutes } from './components/ProtectedRoutes.jsx';
//Pages
// import Home from './pages/Home.jsx';
// import Login from './pages/Login.jsx';
// import Register from './pages/Register.jsx';
// import ForgotPassword from './pages/ForgotPassword.jsx';
// import Donations from './pages/Donations.jsx';
// import Donate from './pages/Donate.jsx';
// import ProductDetails from './pages/ProductDetails.jsx';
// import User from './pages/User.jsx'; // (Profile)
// import OtpDemo from './pages/OtpDemo.jsx';
// import NotFound from './pages/NotFound.jsx';

const router = createBrowserRouter([
	{
		// Rota "Pai": Todas as rotas abaixo usarão este layout
		path: "/",
		element: <MainLayout />, // <-- Layout principal
		errorElement: <NotFound />, // <-- Página de erro para qualquer rota
		children: [
			// --- ROTAS PÚBLICAS ---
			{
				index: true, // index: true significa que esta é a rota para o path: "/"
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

			{
				path: "/forgot-password",
				element: <ForgotPassword />,
			},

			{
				path: "/donations",
				element: <Donations />,
			},

			{
				path: "/products/:id",
				element: <ProductDetails />,
			},

			{
				path: "/demo",
				element: <OtpDemo />,
			},

			// --- ROTAS PROTEGIDAS ---
			{
				element: <ProtectedRoutes />, // <-- O "Segurança"
				children: [
					// Todas as rotas aqui dentro exigirão login
					{
						path: "/profile",
						element: <User />,
					},

					{
						path: "/donate",
						element: <Donate />,
					},
					// Adicione outras rotas que precisam de login aqui
					// ex: { path: "/minha-conta", element: <Account /> }
				],
			},
		],
	},

	{ 
		// Rota Not Found (pode ser colocada dentro do layout principal também)
		path: "*", 
		element: <NotFound /> 
	}
]);

createRoot(document.getElementById('root')).render(
	<StrictMode>
		<AppProviders>
			<RouterProvider router={ router } />
		</AppProviders>
	</StrictMode>,
)