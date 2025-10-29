import React, { useState } from 'react';
// Import both hooks
import { useProduct } from '../hooks/product/useProduct';
import { useSupplier } from '../hooks/supplier/useSupplier';

// DTO: name, category, supplierId, description, productStatus, priceTiers
const DTO_INITIAL_FIELDS = {
	name: '',
	category: '',
	supplierId: '', // Will be a UUID string
	description: '',
	productStatus: 'SELLING', // Default status
	// NEW: Initialize with a base price tier
	priceTiers: [{ minQuantity: 1, pricePerUnit: 0.00 }]
};

// Statuses from ProductStatus.java
const STATUS_OPTIONS = ['SELLING', 'INACTIVE', 'NO_STOCK'];

const Product = () => {
	// Consume both contexts
	const productContext = useProduct();
	const supplierContext = useSupplier();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formData, setFormData] = useState(DTO_INITIAL_FIELDS);
	const [selectedProduct, setSelectedProduct] = useState(null); // for editing
	const [apiError, setApiError] = useState(null); // Form API error

	// Opens the modal to create a new one
	const handleAddNew = () => {
		setSelectedProduct(null);
		setFormData(DTO_INITIAL_FIELDS); // Reset with the initial price tier
		setApiError(null);
		setIsModalOpen(true);
	};

	// Opens the modal to edit an existing one
	const handleEdit = (product) => {
		setSelectedProduct(product);
		
		// Sort price tiers by minimum quantity for stable display
		const sortedTiers = product.priceTiers 
			? [...product.priceTiers].sort((a, b) => a.minQuantity - b.minQuantity)
			: [];

		// Populate form with fields from ProductRequestDTO
		setFormData({
			name: product.name,
			category: product.category,
			supplierId: product.supplierId,
			description: product.description,
			productStatus: product.productStatus,
			// UPDATED: Populate price tiers
			priceTiers: sortedTiers.length > 0 ? sortedTiers : DTO_INITIAL_FIELDS.priceTiers
		});
		setApiError(null);
		setIsModalOpen(true);
	};

	const handleDelete = async (id) => {
		if (window.confirm('Are you sure you want to delete this product?')) {
			try {
				await productContext.deleteProduct(id);
			} catch (err) {
				// Show main error if delete fails
				setApiError(err.message);
			}
		}
	};

	const handleStatusChange = async (id, newStatus) => {
		try {
			await productContext.updateProductStatus(id, newStatus);
		} catch (err) {
			// Show main error if status change fails
			setApiError(err.message);
		}
	}

	// Handler for normal form fields
	const handleChange = (e) => {
		const { name, value, type } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === 'number' ? parseFloat(value) : value
		}));
	};

	// --- NEW HANDLERS FOR PRICE TIERS ---

	// Handles changes in a price tier input
	const handleTierChange = (index, e) => {
		const { name, value } = e.target;
		const newTiers = [...formData.priceTiers];
		const numValue = name === 'minQuantity' ? parseInt(value) || 0 : parseFloat(value) || 0.00;
		
		newTiers[index] = { 
			...newTiers[index], 
			[name]: numValue
		};
		
		setFormData(prev => ({ ...prev, priceTiers: newTiers }));
	};

	// Adds a new empty price tier
	const addTier = () => {
		// Suggest a new quantity based on the highest existing one
		const maxQty = Math.max(0, ...formData.priceTiers.map(t => t.minQuantity));
		setFormData(prev => ({
			...prev,
			priceTiers: [
				...prev.priceTiers, 
				{ minQuantity: maxQty + 1, pricePerUnit: 0.00 }
			].sort((a, b) => a.minQuantity - b.minQuantity) // Keep sorted
		}));
	};

	// Removes a price tier
	const removeTier = (index) => {
		if (formData.priceTiers.length <= 1) {
			setApiError("A product must have at least one price tier.");
			return;
		}
		const newTiers = formData.priceTiers.filter((_, i) => i !== index);
		setFormData(prev => ({ ...prev, priceTiers: newTiers }));
	};

	// --- END OF NEW HANDLERS ---


	const handleSubmit = async (e) => {
		e.preventDefault();
		setApiError(null);

		// --- UPDATED VALIDATION ---
		if (!formData.supplierId) {
			setApiError('You must select a supplier.');
			return;
		}
		if (!formData.priceTiers || formData.priceTiers.length === 0) {
            setApiError('You must add at least one price tier.');
            return;
        }
        if (formData.priceTiers.some(t => t.minQuantity < 1)) {
            setApiError('The minimum quantity for all tiers must be 1 or greater.');
            return;
        }
		// Check if there is at least one tier with minQuantity = 1
		if (!formData.priceTiers.some(t => t.minQuantity === 1)) {
			setApiError('You must define a price for the minimum quantity of 1.');
			return;
		}
        const quantities = formData.priceTiers.map(t => t.minQuantity);
        if (new Set(quantities).size !== quantities.length) {
            setApiError('The minimum quantities for each tier must be unique.');
            return;
        }
		// --- END OF VALIDATION ---

		try {
			if (selectedProduct) {
				// Update (PUT) - formData already contains priceTiers
				await productContext.updateProduct(selectedProduct.idProduct, formData);
			} else {
				// Create (POST) - formData already contains priceTiers
				await productContext.createProduct(formData);
			}
			setIsModalOpen(false); // Close modal on success
		} catch (err) {
			setApiError(err.message); // Show API error in the modal
		}
	};

	// Helper to get the base price for display in the table
	const getBasePrice = (tiers) => {
		if (!tiers || tiers.length === 0) return 0.00;
		
		// Find the price for the smallest quantity (ideally 1)
		const baseTier = tiers.reduce((min, tier) => 
			tier.minQuantity < min.minQuantity ? tier : min
		, tiers[0]);
		
		return baseTier.pricePerUnit;
	};


	// We are loading if *either* context is loading
	if (productContext.loading || supplierContext.loading) {
		return <div className="text-center p-10">Loading data...</div>;
	}

	// Main fetch error
	const fetchError = productContext.error || supplierContext.error;
	if (fetchError && !productContext.loading && !supplierContext.loading) {
		return <div className="text-red-500 text-center p-10">Error: {fetchError}</div>;
	}

	// Delete/status error (shown above table)
	if (apiError && !isModalOpen) {
		return <div className="text-red-500 text-center p-4">{apiError}</div>;
	}

	return (
		<div className="container mx-auto">
			{/* Title and Add Button */}
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-gray-800">My Products</h1>
				<button
					onClick={handleAddNew}
					className="bg-[#777C6D] hover:bg-[#5f6356] text-white font-bold py-2 px-4 rounded-md transition duration-200"
				>
					+ New Product
				</button>
			</div>

			{/* Products Table */}
			<div className="bg-[#FFFFFF] shadow-md rounded-lg overflow-hidden">
				<table className="min-w-full divide-y divide-[#CBCBCB]">
					<thead className="bg-[#EEEEEE]">
						<tr>
							<th className="py-3 px-4 text-left text-sm font-semibold text-[#777C6D] uppercase">Product Name</th>
							<th className="py-3 px-4 text-left text-sm font-semibold text-[#777C6D] uppercase">Category</th>
							{/* UPDATED: Title now refers to the base price */}
							<th className="py-3 px-4 text-left text-sm font-semibold text-[#777C6D] uppercase">Base Price (R$)</th>
							<th className="py-3 px-4 text-left text-sm font-semibold text-[#777C6D] uppercase">Supplier</th>
							<th className="py-3 px-4 text-left text-sm font-semibold text-[#777C6D] uppercase">Status</th>
							<th className="py-3 px-4 text-left text-sm font-semibold text-[#777C6D] uppercase">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-[#EEEEEE]">
						{productContext.products.length === 0 ? (
							<tr>
								<td colSpan="6" className="text-center py-6 text-gray-500">No products found.</td>
							</tr>
						) : (
							productContext.products.map(product => {
								// UPDATED: Calculate the base price for display
								const basePrice = getBasePrice(product.priceTiers);
								
								return (
									<tr key={product.idProduct} className="hover:bg-gray-50">
										<td className="py-4 px-4">{product.name}</td>
										<td className="py-4 px-4">{product.category}</td>
										{/* UPDATED: Display the base price */}
										<td className="py-4 px-4">{basePrice.toFixed(2)}</td>
										<td className="py-4 px-4">{product.supplierName}</td>
										<td className="py-4 px-4">
											<select
												value={product.productStatus}
												onChange={(e) => handleStatusChange(product.idProduct, e.target.value)}
												className="text-xs p-1 rounded border border-[#CBCBCB]"
											>
												{STATUS_OPTIONS.map(status => (
													<option key={status} value={status}>{status}</option>
												))}
											</select>
										</td>
										<td className="py-4 px-4 space-x-2">
											<button
												onClick={() => handleEdit(product)}
												className="text-sm bg-[#B7B89F] hover:bg-[#a7a88f] text-white py-1 px-3 rounded-md"
											>
												Edit
											</button>
											<button
												onClick={() => handleDelete(product.idProduct)}
												className="text-sm bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md"
											>
												Delete
											</button>
										</td>
									</tr>
								)
							})
						)}
					</tbody>
				</table>
			</div>

			{/* Create/Edit Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30 overflow-y-auto p-4">
					<div className="bg-[#FFFFFF] p-8 rounded-lg shadow-xl w-full max-w-2xl my-auto">
						<h2 className="text-2xl font-bold mb-6 text-gray-800">
							{selectedProduct ? 'Edit Product' : 'New Product'}
						</h2>

						{/* Show form error */}
						{apiError && (
							<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
								{apiError}
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">

							<div>
								<label className="block text-sm font-medium text-gray-700">Product Name</label>
								<input
									type="text"
									name="name"
									value={formData.name}
									onChange={handleChange}
									required
									className="mt-1 block w-full px-3 py-2 border border-[#CBCBCB] rounded-md shadow-sm"
								/>
							</div>

							<div className="flex space-x-4">
								<div className="flex-1">
									<label className="block text-sm font-medium text-gray-700">Category</label>
									<input
										type="text"
										name="category"
										value={formData.category}
										onChange={handleChange}
										className="mt-1 block w-full px-3 py-2 border border-[#CBCBCB] rounded-md shadow-sm"
									/>
								</div>
								
								<div className="flex-1">
									<label className="block text-sm font-medium text-gray-700">Supplier</label>
									<select
										name="supplierId"
										value={formData.supplierId}
										onChange={handleChange}
										required
										className="mt-1 block w-full px-3 py-2 border border-[#CBCBCB] rounded-md shadow-sm bg-white"
									>
										<option value="">-- Select a supplier --</option>
										{supplierContext.suppliers.map(supplier => (
											<option key={supplier.idSupplier} value={supplier.idSupplier}>
												{supplier.companyName}
											</option>
										))}
									</select>
								</div>
							</div>
							
							{/* --- PRICE TIERS SECTION (NEW) --- */}
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">Price Tiers</label>
								<div className="space-y-2 max-h-40 overflow-y-auto pr-2">
									{formData.priceTiers.map((tier, index) => (
										<div key={index} className="flex items-center space-x-2">
											<div className="flex-1">
												<label className="text-xs text-gray-600">Min. Quantity</label>
												<input
													type="number"
													name="minQuantity"
													value={tier.minQuantity}
													onChange={(e) => handleTierChange(index, e)}
													required
													min="1"
													className="mt-1 block w-full px-2 py-1 border border-[#CBCBCB] rounded-md shadow-sm"
												/>
											</div>
											<div className="flex-1">
												<label className="text-xs text-gray-600">Price per Unit (R$)</label>
												<input
													type="number"
													name="pricePerUnit"
													value={tier.pricePerUnit}
													onChange={(e) => handleTierChange(index, e)}
													required
													min="0.01"
													step="0.01"
													className="mt-1 block w-full px-2 py-1 border border-[#CBCBCB] rounded-md shadow-sm"
												/>
											</div>
											<button
												type="button"
												onClick={() => removeTier(index)}
												// Disable removal if it's the last tier
												disabled={formData.priceTiers.length <= 1} 
												className="mt-5 text-sm bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded-md disabled:bg-red-300"
											>
												&times;
											</button>
										</div>
									))}
								</div>
								<button
									type="button"
									onClick={addTier}
									className="mt-2 text-sm bg-[#B7B89F] hover:bg-[#a7a88f] text-white py-1 px-3 rounded-md"
								>
									+ Add Tier
								</button>
							</div>
							{/* --- END OF SECTION --- */}

							<div className="flex space-x-4">
								<div className="flex-1">
									<label className="block text-sm font-medium text-gray-700">Status</label>
									<select
										name="productStatus"
										value={formData.productStatus}
										onChange={handleChange}
										required
										className="mt-1 block w-full px-3 py-2 border border-[#CBCBCB] rounded-md shadow-sm bg-white"
									>
										{STATUS_OPTIONS.map(status => (
											<option key={status} value={status}>{status}</option>
										))}
									</select>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">Description</label>
								<textarea
									name="description"
									value={formData.description}
									onChange={handleChange}
									rows="3"
									className="mt-1 block w-full px-3 py-2 border border-[#CBCBCB] rounded-md shadow-sm"
								/>
							</div>

							{/* Form Buttons */}
							<div className="flex justify-end space-x-3 pt-4">
								<button
									type="button"
									onClick={() => setIsModalOpen(false)}
									className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md"
								>
									Cancel
								</button>
								<button
									type="submit"
									className="bg-[#777C6D] hover:bg-[#5f6356] text-white font-bold py-2 px-4 rounded-md"
								>
									{selectedProduct ? 'Update' : 'Save'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default Product;