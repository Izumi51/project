import { useState, useEffect, useCallback, createContext } from 'react';
import BiddingContext from './BiddingContext';
import api from '../../api/axios';
import { useAuth } from '../../hooks/auth/useAuth'; 

const BiddingProvider = ({ children }) => {
    const [biddings, setBiddings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Import the auth hook to get the userId
    const { userId, isAuthenticated } = useAuth();

    // Function to fetch all biddings
    const fetchBiddings = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            // Calls the GET /api/bidding endpoint
            const response = await api.get('/bidding');
            setBiddings(response.data);
        } catch (err) {
            setError(err.message || 'Error fetching biddings');
        } finally {
            setLoading(false);
        }
    }, []);

    // Loads biddings when the provider is mounted
    useEffect(() => {
        if (isAuthenticated) {
            fetchBiddings();
        } else {
            setLoading(false);
        }
    }, [fetchBiddings, isAuthenticated]);

    // Function to CREATE a new bidding
    const createBidding = async (biddingData) => {
        try {
            // Calls POST /api/bidding?userId=...
            // The BiddingRequestDTO is sent in the body
            const response = await api.post(`/bidding?userId=${userId}`, biddingData);

            // Adds the new bidding to the local state (or re-fetches all)
            // The response.data is a BiddingResponseDTO
            setBiddings(prevBiddings => [...prevBiddings, response.data]);
        } catch (err) {
            console.error("Error creating bidding:", err);
            throw new Error(err.response?.data?.message || 'Error creating bidding');
        }
    };

    // Function to UPDATE a bidding
    const updateBidding = async (id, biddingData) => {
        try {
            // Calls PUT /api/bidding/{id}
            const response = await api.put(`/bidding/${id}`, biddingData);

            // Updates the local state
            setBiddings(prevBiddings =>
                prevBiddings.map(b => (b.idBidding === id ? response.data : b))
            );
        } catch (err) {
            console.error("Error updating bidding:", err);
            throw new Error(err.response?.data?.message || 'Error updating bidding');
        }
    };

    // Function to DELETE a bidding
    const deleteBidding = async (id) => {
        try {
            // Calls DELETE /api/bidding/{id}
            await api.delete(`/bidding/${id}`);

            // Removes from the local state
            setBiddings(prevBiddings =>
                prevBiddings.filter(b => b.idBidding !== id)
            );
        } catch (err) {
            console.error("Error deleting bidding:", err);
            throw new Error(err.response?.data?.message || 'Error deleting bidding');
        }
    };

    // Function to UPDATE THE STATUS
    const updateBiddingStatus = async (id, status) => {
        try {
            // Calls PUT /api/bidding/{id}/status
            // The DTO is { status: "NEW_STATUS" }
            const response = await api.put(`/bidding/${id}/status`, { status });

            // Updates the local state
            setBiddings(prevBiddings =>
                prevBiddings.map(b => (b.idBidding === id ? response.data : b))
            );
        } catch (err) {
            console.error("Error updating status:", err);
            throw new Error(err.response?.data?.message || 'Error updating status');
        }
    };


    return (
        <BiddingContext.Provider value={{
            biddings,
            loading,
            error,
            fetchBiddings,
            createBidding,
            updateBidding,
            deleteBidding,
            updateBiddingStatus
        }}>
            {children}
        </BiddingContext.Provider>
    );
};

export default BiddingProvider;