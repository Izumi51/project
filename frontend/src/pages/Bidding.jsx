import React, { useState, useEffect } from 'react';
import { useBidding } from '../hooks/bidding/useBidding';

// BiddingRequestDTO fields: name, description, productBidding, quantity, category
const DTO_CAMPOS_INICIAIS = {
	name: '',
	description: '',
	productBidding: '',
	quantity: 0,
	category: ''
};

// Possible statuses from BiddingStatus.java
const STATUS_OPTIONS = ['ONGOING', 'FINISHED', 'STARTING', 'IN_ANALYSIS', 'AWARDED'];

const Bidding = () => {
	const {
		biddings,
		loading,
		error,
		createBidding,
		updateBidding,
		deleteBidding,
		updateBiddingStatus
	} = useBidding();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formData, setFormData] = useState(DTO_CAMPOS_INICIAIS);
	const [selectedBidding, setSelectedBidding] = useState(null); // for editing
	const [apiError, setApiError] = useState(null); // Form API error

	// Opens the modal to create a new one
	const handleAddNew = () => {
		setSelectedBidding(null);
		setFormData(DTO_CAMPOS_INICIAIS);
		setApiError(null);
		setIsModalOpen(true);
	};

	// Opens the modal to edit an existing one
	const handleEdit = (bidding) => {
		setSelectedBidding(bidding);
		// Ensures the form only has DTO fields
		setFormData({
			name: bidding.name,
			description: bidding.description,
			productBidding: bidding.productBidding,
			quantity: bidding.quantity,
			category: bidding.category
		});
		setApiError(null);
		setIsModalOpen(true);
	};

	const handleDelete = async (id) => {
		if (window.confirm('Are you sure you want to delete this bidding?')) {
			try {
				await deleteBidding(id);
			} catch (err) {
				setApiError(err.message);
			}
		}
	};

	const handleStatusChange = async (id, newStatus) => {
		try {
			await updateBiddingStatus(id, newStatus);
		} catch (err) {
			setApiError(err.message);
		}
	}

	const handleChange = (e) => {
		const { name, value, type } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: type === 'number' ? parseInt(value, 10) : value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setApiError(null);

		try {
			if (selectedBidding) {
				// Update (PUT)
				await updateBidding(selectedBidding.idBidding, formData);
			} else {
				// Create (POST)
				await createBidding(formData);
			}
			setIsModalOpen(false); // Closes the modal on success
		} catch (err) {
			setApiError(err.message); // Shows API error in the modal
		}
	};

	if (loading) return <div className="text-center p-10">Loading biddings...</div>;
	// Main fetch error display
	if (error && !loading) return <div className="text-red-500 text-center p-10">Error: {error}</div>;

	return (
		<div className="container mx-auto p-4 md:p-6">
			{/* Page Header (Estilo de Product.jsx) */}
			<div className="flex justify-between items-center mb-6 pb-4 border-b border-[#CBCBCB]">
				<h1 className="text-2xl md:text-3xl font-bold text-gray-800">My Biddings</h1>
				<button
					onClick={handleAddNew}
					className="bg-[#777C6D] hover:bg-[#5f6356] text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out flex items-center space-x-1"
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
					</svg>
					<span>New Bidding</span>
				</button>
			</div>

			{/* API Error (Estilo de Product.jsx) */}
			{apiError && !isModalOpen && (
				<div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center" role="alert">
					{apiError}
				</div>
			)}

			{/* Biddings Table (Estilo de Product.jsx) */}
			<div className="bg-[#FFFFFF] shadow-md rounded-lg overflow-x-auto">
				<table className="min-w-full divide-y divide-[#EEEEEE]">
					<thead className="bg-gray-50">
						<tr>
							<th className="py-3 px-4 text-left text-xs font-semibold text-[#777C6D] uppercase tracking-wider">Name</th>
							<th className="py-3 px-4 text-left text-xs font-semibold text-[#777C6D] uppercase tracking-wider">Product</th>
							<th className="py-3 px-4 text-left text-xs font-semibold text-[#777C6D] uppercase tracking-wider">Qty.</th>
							<th className="py-3 px-4 text-left text-xs font-semibold text-[#777C6D] uppercase tracking-wider">Status</th>
							<th className="py-3 px-4 text-left text-xs font-semibold text-[#777C6D] uppercase tracking-wider">Actions</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-[#EEEEEE]">
						{biddings.length === 0 ? (
							<tr>
								<td colSpan="5" className="text-center py-6 text-gray-500">No biddings found.</td>
							</tr>
						) : (
							biddings.map(bidding => (
								<tr key={bidding.idBidding} className="hover:bg-gray-50 transition duration-150 ease-in-out">
									<td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{bidding.name}</td>
									<td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{bidding.productBidding}</td>
									<td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{bidding.quantity}</td>
									<td className="py-4 px-4 whitespace-nowrap text-sm">
										<select
											value={bidding.biddingStatus}
											onChange={(e) => handleStatusChange(bidding.idBidding, e.target.value)}
											className="text-xs p-1 rounded border border-[#CBCBCB] w-full"
											aria-label={`Status for ${bidding.name}`}
										>
											{STATUS_OPTIONS.map(status => (
												<option key={status} value={status}>{status}</option>
											))}
										</select>
									</td>
									<td className="py-4 px-4 whitespace-nowrap text-sm space-x-2">
										<button
											onClick={() => handleEdit(bidding)}
											className="text-[#777C6D] hover:text-[#5f6356] font-medium transition duration-150 ease-in-out"
											aria-label={`Edit ${bidding.name}`}
										>
											Edit
										</button>
										<button
											onClick={() => handleDelete(bidding.idBidding)}
											className="text-red-600 hover:text-red-800 font-medium transition duration-150 ease-in-out"
											aria-label={`Delete ${bidding.name}`}
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

			{/* Create/Edit Modal (Corrigido na etapa anterior) */}
			{isModalOpen && (
				<div className="fixed inset-0 z-40 overflow-y-auto bg-[#EEEEEE]/80 backdrop-blur-sm flex items-center justify-center p-4">
					
					<div className="bg-[#FFFFFF] p-6 rounded-lg shadow-xl w-full max-w-4xl border border-[#CBCBCB]">
						
						{/* Modal Header */}
						<div className="flex justify-between items-center pb-3 border-b border-[#EEEEEE]">
							<h2 className="text-xl font-semibold text-gray-800">
								{selectedBidding ? 'Edit Bidding' : 'New Bidding'}
							</h2>
							<button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600 focus:outline-none">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						{/* Modal Body */}
						<div className="mt-4">

							{/* Shows form error */}
							{apiError && (
								<div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
									<p className="font-bold">Error</p>
									<p>{apiError}</p>
								</div>
							)}

							<form onSubmit={handleSubmit} className="space-y-4">
								<div>
									<label className="block text-sm font-medium text-gray-700">Bidding Name</label>
									<input
										type="text"
										name="name"
										value={formData.name}
										onChange={handleChange}
										required
										className="mt-1 block w-full px-3 py-2 border border-[#CBCBCB] rounded-md shadow-sm"
									/>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">Desired Product</label>
									<input
										type="text"
										name="productBidding"
										value={formData.productBidding}
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
										<label className="block text-sm font-medium text-gray-700">Quantity</label>
										<input
											type="number"
											name="quantity"
											value={formData.quantity}
											onChange={handleChange}
											required
											min="1"
											className="mt-1 block w-full px-3 py-2 border border-[#CBCBCB] rounded-md shadow-sm"
										/>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-700">Description</label>
									<textarea
										name="description"
										value={formData.description}
										onChange={handleChange}
										rows="4"
										className="mt-1 block w-full px-3 py-2 border border-[#CBCBCB] rounded-md shadow-sm"
									/>
								</div>

								{/* Form Buttons */}
								<div className="flex justify-end space-x-3 pt-4 border-t border-[#EEEEEE] mt-6">
									<button
										type="button"
										onClick={() => setIsModalOpen(false)}
										className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out"
									>
										Cancel
									</button>
									<button
										type="submit"
										className="bg-[#777C6D] hover:bg-[#5f6356] text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out"
									>
										{selectedBidding ? 'Update' : 'Save'}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Bidding;