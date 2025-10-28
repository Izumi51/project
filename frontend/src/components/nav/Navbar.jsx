import React from 'react';
import { NavLink } from 'react-router';

const NavBar = () => {
	return (<>
		<section>
			<nav>
				<ul>
					<li>
						<NavLink>Página inicial</NavLink>
					</li>
					
					<li>
						<NavLink>Sobre</NavLink>
					</li>
					
					<li>
						<NavLink>Contato</NavLink>
					</li>
				</ul>
			</nav>
		</section>
	</>);
};

export default NavBar;