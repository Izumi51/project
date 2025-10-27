import { AuthProvider } from './auth/AuthContext';
import { ProductProvider } from './product/ProductContext';
import { SupplierProvider } from './product/ProductContext';
import { BiddingProvider } from './bidding/BiddingContext';

export const AppProviders = ({ children }) => {
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