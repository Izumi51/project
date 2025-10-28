import React from 'react';
import { Outlet, ScrollRestoration } from 'react-router';
import NavBar from './nav/Navbar';
import Footer from './footer/Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex">
      <ScrollRestoration />

      {/* Sidebar fixa */}
      <NavBar />

      {/* Conteúdo principal */}
      <div className="flex-1 ml-60 flex flex-col min-h-screen">
        <main className="flex-1 p-6 text-black dark:text-white bg-gray-50">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default MainLayout;
