import { Outlet, ScrollRestoration } from 'react-router-dom';

// Importe seus componentes de layout
import Navbar from './Navbar'; 
import Footer from './Footer';

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