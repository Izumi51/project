import { createContext } from 'react';

export const MatchContext = createContext({
    matches: [],          // Stores the list of MatchResponseDTOs
    loading: false,       // Loading state specific to fetching matches
    error: null,          // Error state specific to fetching matches
    fetchMatches: async (biddingId) => {}, // Function to trigger match fetching
});