import { Outlet, ScrollRestoration } from 'react-router';

// Importe seus componentes de layout
import Navbar from './nav/Navbar'; 
import Footer from './footer/Footer';

const MainLayout = () => {
    return (
        <>
            <ScrollRestoration />

            <Navbar />

            <main>
                <Outlet />
            </main>

            <Footer />
        </>
    );
};

export default MainLayout;