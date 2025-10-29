import { useContext } from 'react';
import MatchContext from '../../context/match/MatchContext';

/**
    Custom hook to access the Match context.
    Provides an easy way to get match state and the fetch function.
    Throws an error if used outside of a MatchProvider.
    @returns {object} The match context value.
*/
export const useMatch = () => {
    const context = useContext(MatchContext);

    if (context === undefined) {
        throw new Error('useMatch must be used within a MatchProvider');
    }

    return context;
};