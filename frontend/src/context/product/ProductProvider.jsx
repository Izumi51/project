const ProductProvider = ({ children }) => {

    return (
        <ProductContext.Provider value={{ }}>
            {children}
        </ProductContext.Provider>
    );
};

export default ProductProvider;