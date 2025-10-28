import ProductContext from './ProductContext'

const ProductProvider = ({ children }) => {

    return (
        <ProductContext.Provider value={{ null:null }}>
            {children}
        </ProductContext.Provider>
    );
};

export default ProductProvider;