import { createContext } from 'react';

const BiddingContext = createContext({
    biddings: [],
    loading: true,
    error: null,
    fetchBiddings: () => {},
    createBidding: async () => {},
    updateBidding: async () => {},
    deleteBidding: async () => {},
    updateBiddingStatus: async () => {},
});

export default BiddingContext;