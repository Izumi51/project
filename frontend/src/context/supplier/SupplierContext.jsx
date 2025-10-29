import { createContext } from 'react';

const SupplierContext = createContext({
    suppliers: [],
    loading: true,
    error: null,
    fetchSuppliers: () => { },
    createSupplier: async () => { },
    updateSupplier: async () => { },
    deleteSupplier: async () => { },
    updateSupplierStatus: async () => { },
});

export default SupplierContext;