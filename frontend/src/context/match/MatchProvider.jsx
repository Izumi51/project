import { useState, useCallback } from 'react';
import MatchContext from './MatchContext';
import api from '../../api/axios';

const MatchProvider = ({ children }) => {
    const [matches, setMatches] = useState([]);
    const [loading, setLoading] = useState(false); // Initially not loading
    const [error, setError] = useState(null);

    // Function to fetch matches for a specific bidding ID
    const fetchMatches = useCallback(async (biddingId) => {
        if (!biddingId) {
            setMatches([]); // Clear matches if no bidding is selected
            return;
        }
        setLoading(true);
        setError(null);
        setMatches([]); // Clear previous matches before fetching new ones
        try {
            // Calls the endpoint: GET /api/match/{biddingId}
            const response = await api.get(`/match/${biddingId}`);
            setMatches(response.data); // response.data should be List<MatchResponseDTO>
        } catch (err) {
            setError(err.message || `Error fetching matches for bidding ${biddingId}`);
            console.error("Error fetching matches:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <MatchContext.Provider value={{
            matches,
            loading,
            error,
            fetchMatches
        }}>
            {children}
        </MatchContext.Provider>
    );
};

export default MatchProvider;