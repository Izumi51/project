import React, { useState } from 'react';
// Import both hooks
import { useProduct } from '../hooks/product/useProduct';
import { useSupplier } from '../hooks/supplier/useSupplier';

// DTO: name, category, supplierId, pricePerUnit, description, productStatus
const DTO_INITIAL_FIELDS = {
	name: '',
	category: '',
	supplierId: '', // Will be a UUID string
	pricePerUnit: 0,
	description: '',
	productStatus: 'SELLING' // Default status
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
		setFormData(DTO_INITIAL_FIELDS);
		setApiError(null);
		setIsModalOpen(true);
	};

	// Opens the modal to edit an existing one
	const handleEdit = (product) => {
		setSelectedProduct(product);
		// Populate form with fields from ProductRequestDTO
		setFormData({
			name: product.name,
			category: product.category,
			supplierId: product.supplierId,
			pricePerUnit: product.pricePerUnit,
			description: product.description,
			productStatus: product.productStatus
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

	const handleChange = (e) => {
		const { name, value, type } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === 'number' ? parseFloat(value) : value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setApiError(null);

		// Client-side validation for supplier
		if (!formData.supplierId) {
			setApiError('You must select a supplier.');
			return;
		}

		try {
			if (selectedProduct) {
				// Update (PUT)
				await productContext.updateProduct(selectedProduct.idProduct, formData);
			} else {
				// Create (POST)
				await productContext.createProduct(formData);
			}
			setIsModalOpen(false); // Close modal on success
		} catch (err) {
			setApiError(err.message); // Show API error in the modal
		}
	};

	// We are loading if *either* context is loading
	if (productContext.loading || supplierContext.loading) {
		return <div className="text-center p-10">Loading data...</div>;
	}

	// Main fetch error
	const fetchError = productContext.error || supplierContext.error;
	if (fetchError && !loading) {
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
							<th className="py-3 px-4 text-left text-sm font-semibold text-[#777C6D] uppercase">Price (R$)</th>
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
							productContext.products.map(product => (
								<tr key={product.idProduct} className="hover:bg-gray-50">
									<td className="py-4 px-4">{product.name}</td>
									<td className="py-4 px-4">{product.category}</td>
									<td className="py-4 px-4">{product.pricePerUnit.toFixed(2)}</td>
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
							))
						)}
					</tbody>
				</table>
			</div>

			{/* Create/Edit Modal */}
			{isModalOpen && (
				<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-30">
					<div className="bg-[#FFFFFF] p-8 rounded-lg shadow-xl w-full max-w-2xl">
						<h2 className="text-2xl font-bold mb-6 text-gray-800">
							{selectedProduct ? 'Edit Product' : 'New Product'}
						</h2>

						{/* Shows form error */}
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
									<label className="block text-sm font-medium text-gray-700">Price per Unit (R$)</label>
									<input
										type="number"
										name="pricePerUnit"
										value={formData.pricePerUnit}
										onChange={handleChange}
										required
										min="0.01"
										step="0.01"
										className="mt-1 block w-full px-3 py-2 border border-[#CBCBCB] rounded-md shadow-sm"
									/>
								</div>
							</div>

							<div className="flex space-x-4">
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