import BiddingContext from './BiddingContext';

const BiddingProvider = ({ children }) => {

    return (
        <BiddingContext.Provider value={{ null:null }}>
            {children}
        </BiddingContext.Provider>
    );
};

export default BiddingProvider;