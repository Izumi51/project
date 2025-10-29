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
		<div className="container mx-auto">
			{/* Title and Add Button */}
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-gray-800">My Biddings</h1>
				<button
					onClick={handleAddNew}
					className="bg-[#777C6D] hover:bg-[#5f6356] text-white font-bold py-2 px-4 rounded-md transition duration-200"
				>
					+ New Bidding
				</button>
			</div>

			{/* Biddings Table */}
			<div className="bg-[#FFFFFF] shadow-md rounded-lg overflow-hidden">
				<table className="min-w-full divide-y divide-[#CBCBCB]">
					<thead className="bg-[#EEEEEE]">
						<tr>
							<th className="py-3 px-4 text-left text-sm font-semibold text-[#777C6D] uppercase">Name</th>
							<th className="py-3 px-4 text-left text-sm font-semibold text-[#777C6D] uppercase">Product</th>
							<th className="py-3 px-4 text-left text-sm font-semibold text-[#777C6D] uppercase">Qty.</th>
							<th className="py-3 px-4 text-left text-sm font-semibold text-[#777C6D] uppercase">Status</th>
							<th className="py-3 px-4 text-left text-sm font-semibold text-[#777C6D] uppercase">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-[#EEEEEE]">
						{biddings.length === 0 ? (
							<tr>
								<td colSpan="5" className="text-center py-6 text-gray-500">No biddings found.</td>
							</tr>
						) : (
							biddings.map(bidding => (
								<tr key={bidding.idBidding} className="hover:bg-gray-50">
									<td className="py-4 px-4">{bidding.name}</td>
									<td className="py-4 px-4">{bidding.productBidding}</td>
									<td className="py-4 px-4">{bidding.quantity}</td>
									<td className="py-4 px-4">
										<select
											value={bidding.biddingStatus}
											onChange={(e) => handleStatusChange(bidding.idBidding, e.target.value)}
											className="text-xs p-1 rounded border border-[#CBCBCB]"
										>
											{STATUS_OPTIONS.map(status => (
												<option key={status} value={status}>{status}</option>
											))}
										</select>
									</td>
									<td className="py-4 px-4 space-x-2">
										<button
											onClick={() => handleEdit(bidding)}
											className="text-sm bg-[#B7B89F] hover:bg-[#a7a88f] text-white py-1 px-3 rounded-md"
										>
											Edit
										</button>
										<button
											onClick={() => handleDelete(bidding.idBidding)}
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
							{selectedBidding ? 'Edit Bidding' : 'New Bidding'}
						</h2>

						{/* Shows form error */}
						{apiError && (
							<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
								{apiError}
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
									{selectedBidding ? 'Update' : 'Save'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default Bidding;