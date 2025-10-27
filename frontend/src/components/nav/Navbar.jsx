import React from 'react';

const NavBar = () => {
	return(<>
		<nav className="hidden lg:flex gap-8 items-center">
                <div className="h-full flex items-center group relative p-2">
                    <NavLink to="/" end className={({ isActive }) => navLinkClass(isActive)}>Início</NavLink>
                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-500 group-hover:w-full"></span>
                </div>
                
                <div className="h-full flex items-center group relative p-2">
                    <NavLink to="/Donations" className={({ isActive }) => navLinkClass(isActive)}>Doações!</NavLink>
                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-500 group-hover:w-full"></span>
                </div>
                
                <div className="h-full flex items-center group relative p-2">
                    <NavLink to="/Donate" className={({ isActive }) => navLinkClass(isActive)}>Doe!</NavLink>
                    <span className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-blue-700 transition-all duration-500 group-hover:w-full"></span>
                </div>
                
                <div className="h-fit flex items-center group relative p-2">
                    {isAuthenticated ? (
                        <UserMenu user={user} logout={logout} />
                    ) : (
                        <NavLink to="/Login" className={() => navLinkClassLogin()}>
                            Entrar
                        </NavLink>
                    )}
                </div>
        </nav>
	</>);
};

export default NavBar;