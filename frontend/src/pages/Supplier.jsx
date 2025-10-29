import React, { useState } from 'react';
// Import the hook we just created
import { useSupplier } from '../hooks/supplier/useSupplier';

// DTO fields: companyName, cnpj, contactName, phone, email, supplierStatus
const DTO_INITIAL_FIELDS = {
	companyName: '',
	cnpj: '',
	contactName: '',
	phone: '',
	email: '',
	supplierStatus: 'ACTIVE' // Default status
};

// Statuses from SupplierStatus.java
const STATUS_OPTIONS = ['ACTIVE', 'INACTIVE', 'NO_PRODUCTS'];

const Supplier = () => {
	// Consume the hook
	const {
		suppliers,
		loading,
		error,
		createSupplier,
		updateSupplier,
		deleteSupplier,
		updateSupplierStatus
	} = useSupplier();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formData, setFormData] = useState(DTO_INITIAL_FIELDS);
	const [selectedSupplier, setSelectedSupplier] = useState(null); // for editing
	const [apiError, setApiError] = useState(null); // Form API error

	// Opens the modal to create a new one
	const handleAddNew = () => {
		setSelectedSupplier(null);
		setFormData(DTO_INITIAL_FIELDS);
		setApiError(null);
		setIsModalOpen(true);
	};

	// Opens the modal to edit an existing one
	const handleEdit = (supplier) => {
		setSelectedSupplier(supplier);
		// Ensures the form only has DTO fields
		setFormData({
			companyName: supplier.companyName,
			cnpj: supplier.cnpj,
			contactName: supplier.contactName,
			phone: supplier.phone,
			email: supplier.email,
			supplierStatus: supplier.supplierStatus
		});
		setApiError(null);
		setIsModalOpen(true);
	};

	const handleDelete = async (id) => {
		if (window.confirm('Are you sure you want to delete this supplier?')) {
			try {
				await deleteSupplier(id);
			} catch (err) {
				// Show main error if delete fails
				setApiError(err.message);
			}
		}
	};

	const handleStatusChange = async (id, newStatus) => {
		try {
			await updateSupplierStatus(id, newStatus);
		} catch (err) {
			// Show main error if status change fails
			setApiError(err.message);
		}
	}

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setApiError(null);

		try {
			if (selectedSupplier) {
				// Update (PUT)
				await updateSupplier(selectedSupplier.idSupplier, formData);
			} else {
				// Create (POST)
				await createSupplier(formData);
			}
			setIsModalOpen(false); // Close modal on success
		} catch (err) {
			setApiError(err.message); // Show API error in the modal
		}
	};

	if (loading) return <div className="text-center p-10">Loading suppliers...</div>;
	// Main fetch error
	if (error && !loading) return <div className="text-red-500 text-center p-10">Error: {error}</div>;
	// Delete/status error (shown above table)
	if (apiError && !isModalOpen) return <div className="text-red-500 text-center p-4">{apiError}</div>;


	return (
		<div className="container mx-auto">
			{/* Title and Add Button */}
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-3xl font-bold text-gray-800">My Suppliers</h1>
				<button
					onClick={handleAddNew}
					className="bg-[#777C6D] hover:bg-[#5f6356] text-white font-bold py-2 px-4 rounded-md transition duration-200"
				>
					+ New Supplier
				</button>
			</div>

			{/* Suppliers Table */}
			<div className="bg-[#FFFFFF] shadow-md rounded-lg overflow-hidden">
				<table className="min-w-full divide-y divide-[#CBCBCB]">
					<thead className="bg-[#EEEEEE]">
						<tr>
							<th className="py-3 px-4 text-left text-sm font-semibold text-[#777C6D] uppercase">Company Name</th>
							<th className="py-3 px-4 text-left text-sm font-semibold text-[#777C6D] uppercase">CNPJ</th>
							<th className="py-3 px-4 text-left text-sm font-semibold text-[#777C6D] uppercase">Contact</th>
							<th className="py-3 px-4 text-left text-sm font-semibold text-[#777C6D] uppercase">Status</th>
							<th className="py-3 px-4 text-left text-sm font-semibold text-[#777C6D] uppercase">Actions</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-[#EEEEEE]">
						{suppliers.length === 0 ? (
							<tr>
								<td colSpan="5" className="text-center py-6 text-gray-500">No suppliers found.</td>
							</tr>
						) : (
							suppliers.map(supplier => (
								<tr key={supplier.idSupplier} className="hover:bg-gray-50">
									<td className="py-4 px-4">{supplier.companyName}</td>
									<td className="py-4 px-4">{supplier.cnpj}</td>
									<td className="py-4 px-4">{supplier.contactName}</td>
									<td className="py-4 px-4">
										<select
											value={supplier.supplierStatus}
											onChange={(e) => handleStatusChange(supplier.idSupplier, e.target.value)}
											className="text-xs p-1 rounded border border-[#CBCBCB]"
										>
											{STATUS_OPTIONS.map(status => (
												<option key={status} value={status}>{status}</option>
											))}
										</select>
									</td>
									<td className="py-4 px-4 space-x-2">
										<button
											onClick={() => handleEdit(supplier)}
											className="text-sm bg-[#B7B89F] hover:bg-[#a7a88f] text-white py-1 px-3 rounded-md"
										>
											Edit
										</button>
										<button
											onClick={() => handleDelete(supplier.idSupplier)}
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
							{selectedSupplier ? 'Edit Supplier' : 'New Supplier'}
						</h2>

						{/* Shows form error */}
						{apiError && (
							<div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
								{apiError}
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-4">

							<div className="flex space-x-4">
								<div className="flex-1">
									<label className="block text-sm font-medium text-gray-700">Company Name</label>
									<input
										type="text"
										name="companyName"
										value={formData.companyName}
										onChange={handleChange}
										required
										className="mt-1 block w-full px-3 py-2 border border-[#CBCBCB] rounded-md shadow-sm"
									/>
								</div>
								<div className="flex-1">
									<label className="block text-sm font-medium text-gray-700">CNPJ</label>
									<input
										type="text"
										name="cnpj"
										value={formData.cnpj}
										onChange={handleChange}
										required
										className="mt-1 block w-full px-3 py-2 border border-[#CBCBCB] rounded-md shadow-sm"
									/>
								</div>
							</div>

							<div className="flex space-x-4">
								<div className="flex-1">
									<label className="block text-sm font-medium text-gray-700">Contact Name</label>
									<input
										type="text"
										name="contactName"
										value={formData.contactName}
										onChange={handleChange}
										className="mt-1 block w-full px-3 py-2 border border-[#CBCBCB] rounded-md shadow-sm"
									/>
								</div>
								<div className="flex-1">
									<label className="block text-sm font-medium text-gray-700">Phone</label>
									<input
										type="text"
										name="phone"
										value={formData.phone}
										onChange={handleChange}
										className="mt-1 block w-full px-3 py-2 border border-[#CBCBCB] rounded-md shadow-sm"
									/>
								</div>
							</div>

							<div>
								<label className="block text-sm font-medium text-gray-700">Email</label>
								<input
									type="email"
									name="email"
									value={formData.email}
									onChange={handleChange}
									className="mt-1 block w-full px-3 py-2 border border-[#CBCBCB] rounded-md shadow-sm"
								/>
							</div>

							{/* The Supplier DTO (SupplierRequestDTO) includes the status,
							    unlike Bidding, so we include it in the form. */}
							<div>
								<label className="block text-sm font-medium text-gray-700">Status</label>
								<select
									name="supplierStatus"
									value={formData.supplierStatus}
									onChange={handleChange}
									required
									className="mt-1 block w-full px-3 py-2 border border-[#CBCBCB] rounded-md shadow-sm bg-white"
								>
									{STATUS_OPTIONS.map(status => (
										<option key={status} value={status}>{status}</option>
									))}
								</select>
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
									{selectedSupplier ? 'Update' : 'Save'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
};

export default Supplier;