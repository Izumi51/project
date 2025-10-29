import { useContext } from 'react';
import BiddingContext from '../../context/bidding/BiddingContext'; //

/**
    Custom hook to access the Bidding context.
    Provides an easy way to get bidding state and functions.
    Throws an error if used outside of a BiddingProvider.
    @returns {object} The bidding context value.
*/
export const useBidding = () => {
    const context = useContext(BiddingContext);

    if (context === undefined) {
        throw new Error('useBidding must be used within a BiddingProvider');
    }

    return context;
};