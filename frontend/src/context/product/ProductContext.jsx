import { createContext } from 'react';

const ProductContext = createContext({
    products: [],
    loading: true,
    error: null,
    fetchProducts: () => {},
    createProduct: async () => {},
    updateProduct: async () => {},
    deleteProduct: async () => {},
    updateProductStatus: async () => {},
});

export default ProductContext;