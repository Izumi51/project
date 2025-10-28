import React from 'react';
import { NavLink } from 'react-router';
import { useAuth } from '../../hooks/auth/useAuth';

const NavBar = () => {
	const { isAuthenticated, logout, userName } = useAuth();

	/**
	 * Define as classes do NavLink.
	 * Fundo claro (#EEEEEE) com texto escuro (#777C6D) para links ativos.
	 */
	const getNavLinkClass = ({ isActive }) => {
		return `block w-full text-left py-3 px-4 rounded-md transition duration-200 ${isActive
			// Estilo ativo: Fundo cinza claro, texto escuro
			? 'bg-[#EEEEEE] text-gray-900 font-semibold'
			// Estilo inativo: Texto cinza escuro, hover com fundo cinza claro
			: 'text-gray-700 hover:bg-[#EEEEEE] hover:text-gray-900'
			}`;
	};

	return (
		/* * Container da Sidebar:
		 * - Fundo: #FFFFFF (Branco)
		 * - Texto: #text-gray-900 (Preto/Cinza Escuro)
		 * - Borda: #CBCBCB (Cinza)
		*/
		<aside className="fixed top-0 left-0 h-screen w-60 bg-[#FFFFFF] text-gray-900 flex flex-col border-r border-[#CBCBCB] z-20">

			{/* 1. Área do Logo/Título (Texto escuro) */}
			<div className="p-5 border-b border-[#CBCBCB]">
				<h1 className="text-2xl font-bold text-center text-gray-900">
					ProjectNI
				</h1>
			</div>

			{/* 2. Navegação Principal */}
			<nav className="flex-1 p-3 overflow-y-auto">
				<ul className="space-y-2">
					{/* Links Públicos */}
					<li>
						<NavLink to="/" end className={getNavLinkClass}>
							Página inicial
						</NavLink>
					</li>

					{/* Links Protegidos (só aparecem se logado) */}
					{isAuthenticated && (
						<>
							<li>
								<NavLink to="/bidding" className={getNavLinkClass}>
									Licitação
								</NavLink>
							</li>
							<li>
								<NavLink to="/supplier" className={getNavLinkClass}>
									Fornecedor
								</NavLink>
							</li>
							<li>
								<NavLink to="/product" className={getNavLinkClass}>
									Produto
								</NavLink>
							</li>
							<li>
								<NavLink to="/match" className={getNavLinkClass}>
									Match
								</NavLink>
							</li>
						</>
					)}
				</ul>
			</nav>

			{/* 3. Área do Utilizador/Auth (ajustada para tema claro) */}
			<div className="p-4 border-t border-[#CBCBCB]">
				{isAuthenticated ? (
					<div className="text-center">
						<p className="text-sm text-gray-600 mb-2">Logado como:</p>
						<p className="font-semibold mb-3 truncate text-gray-900" title={userName}>
							{userName}
						</p>
						<button
							onClick={logout}
							className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition duration-200"
						>
							Logout
						</button>
					</div>
				) : (
					<NavLink
						to="/login"
						// Botão de Login com a cor escura da sua paleta
						className="block w-full text-center bg-[#777C6D] hover:bg-[#5f6356] text-white py-2 px-4 rounded-md transition duration-200"
					>
						Login
					</NavLink>
				)}
			</div>
		</aside>
	);
};

export default NavBar;