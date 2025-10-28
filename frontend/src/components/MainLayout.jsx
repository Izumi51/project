import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router';
import NavBar from './nav/Navbar';
import Footer from './footer/Footer';

const MainLayout = () => {
	return (
		<section className="min-h-screen bg-[#EEEEEE] flex">
			<ScrollRestoration />

			<NavBar />

			<section className="flex-1 ml-60 flex flex-col min-h-screen">

				<main className="flex-1 p-6 text-gray-900">
					<Outlet />
				</main>

				<Footer />
			</section>
		</section>
	);
};

export default MainLayout;