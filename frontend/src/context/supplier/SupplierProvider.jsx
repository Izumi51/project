import SupplierContext from './SupplierContext'

const SupplierProvider = ({ children }) => {

    return (
        <SupplierContext.Provider value={{ null:null }}>
            {children}
        </SupplierContext.Provider>
    );
};

export default SupplierProvider;