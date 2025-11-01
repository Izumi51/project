import { useState, useEffect, useCallback } from 'react';
import ProductContext from './ProductContext';
import api from '../../api/axios';

const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { isAuthenticated } = useAuth();

    // Function to fetch all products
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Calls the endpoint: GET /api/product
            const response = await api.get('/product');
            setProducts(response.data);
        } catch (err) {
            setError(err.message || 'Error fetching products');
        } finally {
            setLoading(false);
        }
    }, []);

    // Load products when the provider is mounted
    useEffect(() => {
        if (isAuthenticated) {
            fetchProducts();
        } else {
            setLoading(false);
        }
    }, [fetchProducts, isAuthenticated]);

    // Function to CREATE a new product
    const createProduct = async (productData) => {
        try {
            // Calls: POST /api/product
            // The ProductRequestDTO is sent in the body
            const response = await api.post('/product', productData);

            // Adds the new product to the local state
            setProducts(prevProducts => [...prevProducts, response.data]);
        } catch (err) {
            console.error("Error creating product:", err);
            // Throws the error for the modal to catch
            throw new Error(err.response?.data?.message || 'Error creating product');
        }
    };

    // Function to UPDATE a product
    const updateProduct = async (id, productData) => {
        try {
            // Calls: PUT /api/product/{id}
            const response = await api.put(`/product/${id}`, productData);

            // Updates the local state
            setProducts(prevProducts =>
                prevProducts.map(p => (p.idProduct === id ? response.data : p))
            );
        } catch (err) {
            console.error("Error updating product:", err);
            throw new Error(err.response?.data?.message || 'Error updating product');
        }
    };

    // Function to DELETE a product
    const deleteProduct = async (id) => {
        try {
            // Calls: DELETE /api/product/{id}
            await api.delete(`/product/${id}`);

            // Removes from the local state
            setProducts(prevProducts =>
                prevProducts.filter(p => p.idProduct !== id)
            );
        } catch (err) {
            console.error("Error deleting product:", err);
            throw new Error(err.response?.data?.message || 'Error deleting product');
        }
    };

    // Function to UPDATE THE STATUS
    const updateProductStatus = async (id, status) => {
        try {
            // Calls: PUT /api/product/{id}/status
            // The DTO is { status: "NEW_STATUS" }
            const response = await api.put(`/product/${id}/status`, { status });

            // Updates the local state
            setProducts(prevProducts =>
                prevProducts.map(p => (p.idProduct === id ? response.data : p))
            );
        } catch (err) {
            console.error("Error updating status:", err);
            throw new Error(err.response?.data?.message || 'Error updating status');
        }
    };

    return (
        <ProductContext.Provider value={{
            products,
            loading,
            error,
            fetchProducts,
            createProduct,
            updateProduct,
            deleteProduct,
            updateProductStatus
        }}>
            {children}
        </ProductContext.Provider>
    );
};

export default ProductProvider;