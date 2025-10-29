import { useContext } from 'react';
import ProductContext from '../../context/product/ProductContext';

/**
    Custom hook to access the Product context.
    Provides an easy way to get product state and functions.
    Throws an error if used outside of a ProductProvider.
    @returns {object} The product context value.
*/
export const useProduct = () => {
    const context = useContext(ProductContext);

    if (context === undefined) {
        throw new Error('useProduct must be used within a ProductProvider');
    }

    return context;
};