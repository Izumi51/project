import { useContext } from 'react';
import SupplierContext from '../../context/supplier/SupplierContext';

/**
    Custom hook to access the Supplier context.
    Provides an easy way to get supplier state and functions.
    Throws an error if used outside of a SupplierProvider.
    @returns {object} The supplier context value.
*/
export const useSupplier = () => {
    const context = useContext(SupplierContext);

    if (context === undefined) {
        throw new Error('useSupplier must be used within a SupplierProvider');
    }

    return context;
};