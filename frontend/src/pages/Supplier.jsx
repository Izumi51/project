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
  supplierStatus: 'ACTIVE',
  fixedCost: '' 
};

// Statuses from SupplierStatus.java
const STATUS_OPTIONS = ['Ativo', 'Inativo', 'Sem Produtos'];

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
    setFormData({
      companyName: supplier.companyName,
      cnpj: supplier.cnpj,
      contactName: supplier.contactName,
      phone: supplier.phone,
      email: supplier.email,
      supplierStatus: supplier.supplierStatus,
      fixedCost: supplier.fixedCost || ''
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

	return (
		<div className="container mx-auto p-4 md:p-6">
			{/* Page Header (Estilo de Product.jsx) */}
			<div className="flex justify-between items-center mb-6 pb-4 border-b border-[#CBCBCB]">
				<h1 className="text-2xl md:text-3xl font-bold text-gray-800">Meus Fornecedores</h1>
				<button
					onClick={handleAddNew}
					className="bg-[#777C6D] hover:bg-[#5f6356] text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out flex items-center space-x-1"
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
						<path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
					</svg>
					<span>Novo Fornecedor</span>
				</button>
			</div>
			
			{/* API Error (Estilo de Product.jsx) */}
			{apiError && !isModalOpen && (
				<div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center" role="alert">
					{apiError}
				</div>
			)}


			{/* Suppliers Table (Estilo de Product.jsx) */}
			<div className="bg-[#FFFFFF] shadow-md rounded-lg overflow-x-auto">
				<table className="min-w-full divide-y divide-[#EEEEEE]">
					<thead className="bg-gray-50">
						<tr>
							<th className="py-3 px-4 text-left text-xs font-semibold text-[#777C6D] uppercase tracking-wider">Nome da Empresa</th>
							<th className="py-3 px-4 text-left text-xs font-semibold text-[#777C6D] uppercase tracking-wider">CNPJ</th>
							<th className="py-3 px-4 text-left text-xs font-semibold text-[#777C6D] uppercase tracking-wider">Contato</th>
							<th className="py-3 px-4 text-left text-xs font-semibold text-[#777C6D] uppercase tracking-wider">Status</th>
							<th className="py-3 px-4 text-left text-xs font-semibold text-[#777C6D] uppercase tracking-wider">Ações</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-[#EEEEEE]">
						{suppliers.length === 0 ? (
							<tr>
								<td colSpan="5" className="text-center py-6 text-gray-500">Nenhum Fornecedor Encontrado</td>
							</tr>
						) : (
							suppliers.map(supplier => (
								<tr key={supplier.idSupplier} className="hover:bg-gray-50 transition duration-150 ease-in-out">
									<td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{supplier.companyName}</td>
									<td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{supplier.cnpj}</td>
									<td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{supplier.contactName}</td>
									<td className="py-4 px-4 whitespace-nowrap text-sm">
										<select
											value={supplier.supplierStatus}
											onChange={(e) => handleStatusChange(supplier.idSupplier, e.target.value)}
											className="text-xs p-1 rounded border border-[#CBCBCB] w-full"
											aria-label={`Status for ${supplier.companyName}`}
										>
											{STATUS_OPTIONS.map(status => (
												<option key={status} value={status}>{status}</option>
											))}
										</select>
									</td>
									<td className="py-4 px-4 whitespace-nowrap text-sm space-x-2">
										<button
											onClick={() => handleEdit(supplier)}
											className="text-[#777C6D] hover:text-[#5f6356] font-medium transition duration-150 ease-in-out"
											aria-label={`Edit ${supplier.companyName}`}
										>
											Editar
										</button>
										<button
											onClick={() => handleDelete(supplier.idSupplier)}
											className="text-red-600 hover:text-red-800 font-medium transition duration-150 ease-in-out"
											aria-label={`Delete ${supplier.companyName}`}
										>
											Deletar
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
				<div className="fixed inset-0 z-40 overflow-y-auto bg-[#EEEEEE]/80 backdrop-blur-sm flex items-center justify-center p-4">

					<div className="bg-[#FFFFFF] p-6 rounded-lg shadow-xl w-full max-w-4xl border border-[#CBCBCB]">
						
						{/* Modal Header */}
						<div className="flex justify-between items-center pb-3 border-b border-[#EEEEEE]">
							<h2 className="text-xl font-semibold text-gray-800">
								{selectedSupplier ? 'Editar Fornecedor' : 'Novo Fornecedor'}
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

								<div className="flex space-x-4">
									<div className="flex-1">
										<label className="block text-sm font-medium text-gray-700">Nome da Empresa</label>
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
										<label className="block text-sm font-medium text-gray-700">Nome de Contato</label>
										<input
											type="text"
											name="contactName"
											value={formData.contactName}
											onChange={handleChange}
											className="mt-1 block w-full px-3 py-2 border border-[#CBCBCB] rounded-md shadow-sm"
										/>
									</div>
									<div className="flex-1">
										<label className="block text-sm font-medium text-gray-700">Telefone</label>
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

								<div>
									<label className="block text-sm font-medium text-gray-700">Custo Fixo de Ativação (Frete)</label>
									<input
										type="number"
										name="fixedCost"
										value={formData.fixedCost}
										onChange={handleChange}
										step="0.01"
										placeholder="0.00"
										className="mt-1 block w-full px-3 py-2 border border-[#CBCBCB] rounded-md shadow-sm"
									/>
								</div>

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
								<div className="flex justify-end space-x-3 pt-4 border-t border-[#EEEEEE] mt-6">
									<button
										type="button"
										onClick={() => setIsModalOpen(false)}
										className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out"
									>
										Cancelar
									</button>
									<button
										type="submit"
										className="bg-[#777C6D] hover:bg-[#5f6356] text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out"
									>
										{selectedSupplier ? 'Atualizar' : 'Salvar'}
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

export default Supplier;