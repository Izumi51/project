import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import api from '../api/axios'; // Imports the axios instance

// --- Detail Card Component ---
const DetailCard = ({ title, children }) => (
    <div className="bg-white shadow-md rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
        </div>
        <div className="p-5 space-y-4">
            {children}
        </div>
    </div>
);

// --- Detail Item Component ---
const DetailItem = ({ label, value }) => (
    <div>
        <span className="text-sm text-gray-500 block">{label}</span>
        <span className="text-base text-gray-900 font-medium">{value || '-'}</span>
    </div>
);

const MatchDetails = () => {
    const { productId, supplierId } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [supplier, setSupplier] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch product details
                const productResponse = await api.get(`/product/${productId}`);
                setProduct(productResponse.data);

                // Fetch supplier details
                const supplierResponse = await api.get(`/supplier/${supplierId}`);
                setSupplier(supplierResponse.data);

            } catch (err) {
                setError(err.message || 'Failed to fetch details.');
                console.error("Error fetching details:", err);
            } finally {
                setLoading(false);
            }
        };

        if (productId && supplierId) {
            fetchData();
        }
    }, [productId, supplierId]);

    if (loading) return <div className="text-center p-10 text-gray-600">Loading details...</div>;

    if (error) return (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md" role="alert">
            <p className="font-bold">Error loading details</p>
            <p>{error}</p>
        </div>
    );

    if (!product || !supplier) return <div className="text-center p-10 text-gray-500">No data found.</div>;

    // Sort product price tiers
    const sortedTiers = product.priceTiers ? [...product.priceTiers].sort((a, b) => a.minQuantity - b.minQuantity) : [];

    return (
        <div className="container mx-auto p-4 md:p-6">
            {/* Page Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#CBCBCB]">
                <div className="flex items-center">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Match Details</h1>
                </div>
                <button
                    onClick={() => navigate(-1)} // Go back to the previous page (Match)
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out"
                >
                    &larr; Back to Matches
                </button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Product Details Card */}
                <DetailCard title="Product Details">
                    <DetailItem label="Product Name" value={product.name} />
                    <DetailItem label="Category" value={product.category} />
                    <DetailItem label="Status" value={product.productStatus} />
                    <div>
                        <span className="text-sm text-gray-500 block">Description</span>
                        <p className="text-base text-gray-900 font-medium">{product.description || '-'}</p>
                    </div>

                    {/* Price Tiers Table */}
                    <div>
                        <span className="text-sm text-gray-500 block mb-2">Price Tiers</span>
                        <div className="border border-gray-200 rounded-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="py-2 px-3 text-left text-xs font-semibold text-[#777C6D] uppercase">Min. Quantity</th>
                                        <th className="py-2 px-3 text-left text-xs font-semibold text-[#777C6D] uppercase">Price / Unit</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {sortedTiers.length > 0 ? (
                                        sortedTiers.map(tier => (
                                            <tr key={tier.minQuantity}>
                                                <td className="py-3 px-3 text-sm text-gray-700">{tier.minQuantity}</td>
                                                <td className="py-3 px-3 text-sm text-gray-700">R$ {tier.pricePerUnit.toFixed(2)}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="2" className="py-3 px-3 text-sm text-gray-500 text-center">No price tiers available.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </DetailCard>

                {/* Supplier Details Card */}
                <DetailCard title="Supplier Details">
                    <DetailItem label="Company Name" value={supplier.companyName} />
                    <DetailItem label="CNPJ" value={supplier.cnpj} />
                    <DetailItem label="Contact Name" value={supplier.contactName} />
                    <DetailItem label="Phone" value={supplier.phone} />
                    <DetailItem label="Email" value={supplier.email} />
                    <DetailItem label="Status" value={supplier.supplierStatus} />
                </DetailCard>
            </div>
        </div>
    );
};

export default MatchDetails;