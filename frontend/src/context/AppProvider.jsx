import AuthProvider from './auth/AuthProvider';
import ProductProvider from './product/ProductProvider';
import SupplierProvider from './supplier/SupplierProvider';
import BiddingProvider from './bidding/BiddingProvider';
import MatchProvider from './match/MatchProvider';

const AppProviders = ({ children }) => {
    return (
        <AuthProvider>
             <BiddingProvider>
                <SupplierProvider>
                    <ProductProvider>
                        <MatchProvider>
                            {children}
                        </MatchProvider>
                    </ProductProvider>
                </SupplierProvider> 
            </BiddingProvider> 
        </AuthProvider>
    );
};

export default AppProviders;