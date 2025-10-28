import AuthProvider from './auth/AuthProvider';
import ProductProvider from './product/ProductProvider';
import SupplierProvider from './supplier/SupplierProvider';
import BiddingProvider from './bidding/BiddingProvider';

const AppProviders = ({ children }) => {
    return (
        <AuthProvider>
             <BiddingProvider>
                <SupplierProvider>
                    <ProductProvider>
                        {children}
                    </ProductProvider>
                </SupplierProvider> 
            </BiddingProvider> 
        </AuthProvider>
    );
};

export default AppProviders;