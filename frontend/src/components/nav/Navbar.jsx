import React from 'react';
import { NavLink } from 'react-router';
import { useAuth } from '../../hooks/auth/useAuth';

const NavBar = () => {
  const { isAuthenticated, logout, userName } = useAuth();

  // Define o estilo dos links de navegação dinamicamente
  const getNavLinkClass = ({ isActive }) =>
    `block w-full text-left py-3 px-4 rounded-md transition duration-200 ${
      isActive
        ? 'bg-gray-300 text-blue-700 font-semibold'
        : 'text-gray-700 hover:bg-gray-300'
    }`;

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-gray-200 text-gray-800 flex flex-col border-r border-gray-300 z-20">
      {/* Logo / Título */}
      <div className="p-5 border-b border-gray-300">
        <h1 className="text-2xl font-bold text-center text-blue-600">
          ProjectNI
        </h1>
      </div>

      {/* Navegação principal */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <ul className="space-y-2">
          <li>
            <NavLink to="/" end className={getNavLinkClass}>
              Página inicial
            </NavLink>
          </li>

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

      {/* Área do usuário / autenticação */}
      <div className="p-4 border-t border-gray-300">
        {isAuthenticated ? (
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Logado como:</p>
            <p
              className="font-semibold mb-3 truncate text-gray-900"
              title={userName}
            >
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
            className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition duration-200"
          >
            Login
          </NavLink>
        )}
      </div>
    </aside>
  );
};

export default NavBar;
