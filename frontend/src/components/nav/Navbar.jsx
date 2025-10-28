import React from 'react';
import { NavLink } from 'react-router';
import { useAuth } from '../../hooks/auth/useAuth'



const NavBar = () => {
	const { isAuthenticated, logout, user } = useAuth();
	
	return (<>
		<section>
			<nav>
				<ul>
					<li >
						<NavLink to="/">Página inicial</NavLink>
					</li>

					<li>
						<NavLink to="/bidding">Licitação</NavLink>
					</li>

					<li>
						<NavLink to="/supplier">Fornecedor</NavLink>
					</li>
					
					<li>
						<NavLink to="/product">Produto</NavLink>
					</li>
					
					<li>
						<NavLink to="login">Login</NavLink>
					</li>

					<li>
						<NavLink to="/match">Match</NavLink>
					</li>
				</ul>
			</nav>
		</section>
	</>);
};

export default NavBar;