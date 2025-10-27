const SupplierProvider = ({ children }) => {

    return (
        <SupplierContext.Provider value={{ }}>
            {children}
        </SupplierContext.Provider>
    );
};

export default SupplierProvider;