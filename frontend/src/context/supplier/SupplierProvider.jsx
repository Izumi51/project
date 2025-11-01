import { useState, useEffect, useCallback } from 'react';
import SupplierContext from './SupplierContext';
import api from '../../api/axios';
import { useAuth } from '../../hooks/auth/useAuth';

const SupplierProvider = ({ children }) => {
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { isAuthenticated } = useAuth();

    // Function to fetch all suppliers
    const fetchSuppliers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Calls the endpoint: GET /api/supplier
            const response = await api.get('/supplier');
            setSuppliers(response.data);
        } catch (err) {
            setError(err.message || 'Error fetching suppliers');
        } finally {
            setLoading(false);
        }
    }, []);

    // Load suppliers when the provider is mounted
    useEffect(() => {
        if (isAuthenticated) {
            fetchSuppliers();
        } else {
            setLoading(false);
        }
    }, [fetchSuppliers, isAuthenticated]);

    // Function to CREATE a new supplier
    const createSupplier = async (supplierData) => {
        try {
            // Calls: POST /api/supplier
            const response = await api.post('/supplier', supplierData);

            // Adds the new supplier to the local state
            setSuppliers(prevSuppliers => [...prevSuppliers, response.data]);
        } catch (err) {
            console.error("Error creating supplier:", err);
            // Throws the error for the modal to catch
            throw new Error(err.response?.data?.message || 'Error creating supplier');
        }
    };

    // Function to UPDATE a supplier
    const updateSupplier = async (id, supplierData) => {
        try {
            // Calls: PUT /api/supplier/{id}
            const response = await api.post(`/supplier/update/${id}`, supplierData);

            // Updates the local state
            setSuppliers(prevSuppliers =>
                prevSuppliers.map(s => (s.idSupplier === id ? response.data : s))
            );
        } catch (err) {
            console.error("Error updating supplier:", err);
            throw new Error(err.response?.data?.message || 'Error updating supplier');
        }
    };

    // Function to DELETE a supplier
    const deleteSupplier = async (id) => {
        try {
            // Calls: DELETE /api/supplier/{id}
            await api.post(`/supplier/delete/${id}`);

            // Removes from the local state
            setSuppliers(prevSuppliers =>
                prevSuppliers.filter(s => s.idSupplier !== id)
            );
        } catch (err) {
            console.error("Error deleting supplier:", err);
            throw new Error(err.response?.data?.message || 'Error deleting supplier');
        }
    };

    // Function to UPDATE THE STATUS
    const updateSupplierStatus = async (id, status) => {
        try {
            // Calls: PUT /api/supplier/{id}/status
            // The DTO is { status: "NEW_STATUS" }
            const response = await api.post(`/supplier/update/status/${id}`, { status });

            // Updates the local state
            setSuppliers(prevSuppliers =>
                prevSuppliers.map(s => (s.idSupplier === id ? response.data : s))
            );
        } catch (err) {
            console.error("Error updating status:", err);
            throw new Error(err.response?.data?.message || 'Error updating status');
        }
    };

    return (
        <SupplierContext.Provider value={{
            suppliers,
            loading,
            error,
            fetchSuppliers,
            createSupplier,
            updateSupplier,
            deleteSupplier,
            updateSupplierStatus
        }}>
            {children}
        </SupplierContext.Provider>
    );
};

export default SupplierProvider;