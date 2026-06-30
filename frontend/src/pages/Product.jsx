import React, { useState, useEffect } from 'react';
import { useProduct } from '../hooks/product/useProduct';
import { useSupplier } from '../hooks/supplier/useSupplier';

// DTO initial state
const DTO_INITIAL_FIELDS = {
  name: '',
  category: '',
  idSupplier: '',
  description: '',
  availableQuantity: '',
  unitLogisticCost: '',
  productStatus: 'VENDENDO',
  priceTiers: [{ minQuantity: 1, maxQuantity: 999999, pricePerUnit: 0.00 }]
};

// Status options from backend enum
const STATUS_OPTIONS = ['VENDENDO', 'INATIVO', 'SEM_ESTOQUE'];

// --- Helper Components ---

// Input field component for consistency
const InputField = ({ label, name, value, onChange, type = 'text', required = false, ...props }) => (
	<div>
		<label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
			{label} {required && <span className="text-red-500">*</span>}
		</label>
		<input
			type={type}
			id={name}
			name={name}
			value={value}
			onChange={onChange}
			required={required}
			className="mt-1 block w-full px-3 py-2 border border-[#CBCBCB] rounded-md shadow-sm focus:outline-none focus:ring-[#777C6D] focus:border-[#777C6D] sm:text-sm transition duration-150 ease-in-out"
			{...props}
		/>
	</div>
);

// Select field component
const SelectField = ({ label, name, value, onChange, options, required = false, placeholder, ...props }) => (
	<div>
		<label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
			{label} {required && <span className="text-red-500">*</span>}
		</label>
		<select
			id={name}
			name={name}
			value={value}
			onChange={onChange}
			required={required}
			className="mt-1 block w-full px-3 py-2 border border-[#CBCBCB] rounded-md shadow-sm focus:outline-none focus:ring-[#777C6D] focus:border-[#777C6D] sm:text-sm bg-white transition duration-150 ease-in-out"
			{...props}
		>
			{placeholder && <option value="">{placeholder}</option>}
			{options.map(option => (
				<option key={option.value} value={option.value}>
					{option.label}
				</option>
			))}
		</select>
	</div>
);

// Textarea component
const TextAreaField = ({ label, name, value, onChange, rows = 3, ...props }) => (
	<div>
		<label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
			{label}
		</label>
		<textarea
			id={name}
			name={name}
			value={value}
			onChange={onChange}
			rows={rows}
			className="mt-1 block w-full px-3 py-2 border border-[#CBCBCB] rounded-md shadow-sm focus:outline-none focus:ring-[#777C6D] focus:border-[#777C6D] sm:text-sm transition duration-150 ease-in-out"
			{...props}
		/>
	</div>
);

// Price Tier Row Component
const PriceTierRow = ({ tier, index, onChange, onRemove, canRemove }) => (
	<div className="flex items-end space-x-3 p-3 bg-gray-50 border border-gray-200 rounded-md mb-2 shadow-sm">
		<InputField
			label="Quantidade Mínima"
			type="number"
			name="minQuantity"
			value={tier.minQuantity}
			onChange={(e) => onChange(index, e)}
			required
			min="1"
			placeholder="ex.: 1"
		/>
		<InputField
			label="Quantidade Máxima"
			type="number"
			name="maxQuantity"
			value={tier.maxQuantity}
			onChange={(e) => onChange(index, e)}
			required
			min="1"
			placeholder="ex.: 99"
		/>
		<InputField
			label="Preço por Unidade (R$)"
			type="number"
			name="pricePerUnit"
			value={tier.pricePerUnit}
			onChange={(e) => onChange(index, e)}
			required
			min="0.01"
			step="0.01"
			placeholder="ex.: 10.00"
		/>
		<button
			type="button"
			onClick={() => onRemove(index)}
			disabled={!canRemove}
			className={`px-3 py-2 rounded-md text-white transition duration-150 ease-in-out ${
				canRemove
					? 'bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
					: 'bg-red-300 cursor-not-allowed'
			}`}
			aria-label="Remove price tier"
		>
			{/* Simple icon or text */}
			X
		</button>
	</div>
);

// --- Main Product Component ---

const Product = () => {
	const {
		products,
		loading: productsLoading,
		error: productsError,
		createProduct,
		updateProduct,
		deleteProduct,
		updateProductStatus
	} = useProduct();

	const {
		suppliers,
		loading: suppliersLoading,
		error: suppliersError
	} = useSupplier();

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [formData, setFormData] = useState(DTO_INITIAL_FIELDS);
	const [selectedProduct, setSelectedProduct] = useState(null);
	const [apiError, setApiError] = useState(null);

	// Derived loading and error states
	const isLoading = productsLoading || suppliersLoading;
	const fetchError = productsError || suppliersError;

	// Reset form and close modal
	const closeModal = () => {
		setIsModalOpen(false);
		setFormData(DTO_INITIAL_FIELDS);
		setSelectedProduct(null);
		setApiError(null);
	};

	// Open modal for adding
	const handleAddNew = () => {
		setSelectedProduct(null);
		setFormData(DTO_INITIAL_FIELDS);
		setApiError(null);
		setIsModalOpen(true);
	};

	// Open modal for editing
	const handleEdit = (product) => {
		setSelectedProduct(product);
		const sortedTiers = product.priceTiers
			? [...product.priceTiers].sort((a, b) => a.minQuantity - b.minQuantity)
			: [];
		setFormData({
			name: product.name,
			category: product.category,
			idSupplier: product.idSupplier,
			description: product.description,
			productStatus: product.productStatus,
			priceTiers: sortedTiers.length > 0 ? sortedTiers : DTO_INITIAL_FIELDS.priceTiers
		});
		setApiError(null);
		setIsModalOpen(true);
	};

	// Handle delete action
	const handleDelete = async (id) => {
		if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
			setApiError(null); // Clear previous errors
			try {
				await deleteProduct(id);
			} catch (err) {
				setApiError(err.message || 'Failed to delete product.');
			}
		}
	};

	// Handle status change from table dropdown
	const handleStatusChange = async (id, newStatus) => {
		setApiError(null); // Clear previous errors
		try {
			await updateProductStatus(id, newStatus);
		} catch (err) {
			setApiError(err.message || 'Failed to update status.');
			// Optionally revert UI change or refetch data if needed
		}
	};

	// Generic change handler for simple fields
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	// Price Tier Handlers
	const handleTierChange = (index, e) => {
		const { name, value } = e.target;
		const newTiers = [...formData.priceTiers];
		const numValue = (name === 'minQuantity' || name === 'maxQuantity')
			? parseInt(value, 10) || 0
			: parseFloat(value) || 0.00;
		newTiers[index] = { ...newTiers[index], [name]: numValue };
		setFormData(prev => ({ ...prev, priceTiers: newTiers }));
	};

	const addTier = () => {
		const maxQty = Math.max(0, ...formData.priceTiers.map(t => t.minQuantity));
		const newTier = { minQuantity: maxQty + 1, maxQuantity: 999999, pricePerUnit: 0.00 };
		const updatedTiers = [...formData.priceTiers, newTier].sort((a, b) => a.minQuantity - b.minQuantity);
		setFormData(prev => ({ ...prev, priceTiers: updatedTiers }));
	};

	const removeTier = (index) => {
		if (formData.priceTiers.length <= 1) {
			setApiError("A product must have at least one price tier.");
			return;
		}
		const newTiers = formData.priceTiers.filter((_, i) => i !== index);
		setFormData(prev => ({ ...prev, priceTiers: newTiers }));
	};

	// Form Submission
	const handleSubmit = async (e) => {
  e.preventDefault();
  setApiError(null);

  // VALIDATION
  if (!formData.idSupplier) return setApiError('Fornecedor é Obrigatório');
  if (!formData.priceTiers || formData.priceTiers.length === 0) return setApiError('Pelo Menos um Preço é Obrigatório.');
  if (formData.priceTiers.some(t => t.minQuantity < 1)) return setApiError('A Quantidade Mínima é 1 ou mais.');
  if (formData.priceTiers.some(t => t.maxQuantity < t.minQuantity)) return setApiError('A Quantidade Máxima deve ser maior ou igual à Quantidade Mínima.');
  
  const quantities = formData.priceTiers.map(t => t.minQuantity);
  if (new Set(quantities).size !== quantities.length) return setApiError('Quantidades Mínimas para os Preços devem ser Únicas.');

  // Parse numeric types explicitly to keep Backend numbers clean
  const submissionData = {
    ...formData,
    availableQuantity: parseInt(formData.availableQuantity, 10) || 0,
    unitLogisticCost: parseFloat(formData.unitLogisticCost) || 0.00
  };

  try {
    if (selectedProduct) {
      await updateProduct(selectedProduct.idProduct, submissionData);
    } else {
      await createProduct(submissionData);
    }
    closeModal();
  } catch (err) {
    setApiError(err.message || 'An error occurred while saving the product.');
  }
};

	// Helper to get base price for table display
	const getBasePrice = (tiers) => {
		if (!tiers || tiers.length === 0) return 0.00;
		const baseTier = tiers.reduce((min, tier) => tier.minQuantity < min.minQuantity ? tier : min, tiers[0]);
		return baseTier.pricePerUnit;
	};

	// Map suppliers for SelectField
	const supplierOptions = suppliers.map(s => ({ value: s.idSupplier, label: s.companyName }));
	const statusSelectOptions = STATUS_OPTIONS.map(s => ({ value: s, label: s }));

	// Loading and Error States
	if (isLoading) return <div className="text-center p-10 text-gray-600">Loading data...</div>;
	if (fetchError && !isLoading) return <div className="text-red-600 text-center p-10">Erro carregando dados: {fetchError}</div>;

	return (
		<div className="container mx-auto p-4 md:p-6">
			{/* Page Header */}
			<div className="flex justify-between items-center mb-6 pb-4 border-b border-[#CBCBCB]">
				<h1 className="text-2xl md:text-3xl font-bold text-gray-800">Meus Produtos</h1>
				<button
					onClick={handleAddNew}
					className="bg-[#777C6D] hover:bg-[#5f6356] text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out flex items-center space-x-1"
				>
					<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
  						<path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
					</svg>
					<span>Novo Produto</span>
				</button>
			</div>

			{/* Display API errors related to delete/status update */}
			{apiError && !isModalOpen && (
				<div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center" role="alert">
					{apiError}
				</div>
			)}


			{/* Products Table */}
			<div className="bg-[#FFFFFF] shadow-md rounded-lg overflow-x-auto">
				<table className="min-w-full divide-y divide-[#EEEEEE]">
					<thead className="bg-gray-50">
						<tr>
							<th className="py-3 px-4 text-left text-xs font-semibold text-[#777C6D] uppercase tracking-wider">Nome do Produto</th>
							<th className="py-3 px-4 text-left text-xs font-semibold text-[#777C6D] uppercase tracking-wider">Categoria</th>
							<th className="py-3 px-4 text-left text-xs font-semibold text-[#777C6D] uppercase tracking-wider">Preço Base(R$)</th>
							<th className="py-3 px-4 text-left text-xs font-semibold text-[#777C6D] uppercase tracking-wider">Fornecedor</th>
							<th className="py-3 px-4 text-left text-xs font-semibold text-[#777C6D] uppercase tracking-wider">Status</th>
							<th className="py-3 px-4 text-left text-xs font-semibold text-[#777C6D] uppercase tracking-wider">Ações</th>
						</tr>
					</thead>
					<tbody className="bg-white divide-y divide-[#EEEEEE]">
						{products.length === 0 ? (
							<tr>
								<td colSpan="6" className="text-center py-6 text-gray-500">Nenhum Produto Encontrado</td>
							</tr>
						) : (
							products.map(product => {
								const basePrice = getBasePrice(product.priceTiers);
								return (
									<tr key={product.idProduct} className="hover:bg-gray-50 transition duration-150 ease-in-out">
										<td className="py-4 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.name}</td>
										<td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{product.category || '-'}</td>
										<td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{basePrice.toFixed(2)}</td>
										<td className="py-4 px-4 whitespace-nowrap text-sm text-gray-500">{product.supplierName}</td>
										<td className="py-4 px-4 whitespace-nowrap text-sm">
											<SelectField
												name={`status-${product.idProduct}`}
												value={product.productStatus}
												onChange={(e) => handleStatusChange(product.idProduct, e.target.value)}
												options={statusSelectOptions}
												className="text-xs p-1 rounded border border-[#CBCBCB] w-full"
												aria-label={`Status for ${product.name}`}
											/>
										</td>
										<td className="py-4 px-4 whitespace-nowrap text-sm space-x-2">
											<button
												onClick={() => handleEdit(product)}
												className="text-[#777C6D] hover:text-[#5f6356] font-medium transition duration-150 ease-in-out"
												aria-label={`Edit ${product.name}`}
											>
												Editar
											</button>
											<button
												onClick={() => handleDelete(product.idProduct)}
												className="text-red-600 hover:text-red-800 font-medium transition duration-150 ease-in-out"
												aria-label={`Delete ${product.name}`}
											>
												Deletar
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
				<div className="fixed inset-0 z-40 overflow-y-auto bg-[#EEEEEE]/80 backdrop-blur-sm flex items-center justify-center p-4">
					
					<div className="bg-[#FFFFFF] p-6 rounded-lg shadow-xl w-full max-w-4xl border border-[#CBCBCB]">
						
						{/* Modal Header */}
						<div className="flex justify-between items-center pb-3 border-b border-[#EEEEEE]">
							<h2 className="text-xl font-semibold text-gray-800">
								{selectedProduct ? 'Editar Produto' : 'Criar novo Produto'}
							</h2>
							<button onClick={closeModal} className="text-gray-400 hover:text-gray-600 focus:outline-none">
								<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</div>

						{/* Modal Body */}
						<div className="mt-4">
							{/* Form API Error */}
							{apiError && (
								<div className="mb-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
									<p className="font-bold">Error</p>
									<p>{apiError}</p>
								</div>
							)}

							<form onSubmit={handleSubmit} className="space-y-4">
								<InputField
									label="Nome do Produto"
									name="name"
									value={formData.name}
									onChange={handleChange}
									required
									placeholder="ex.: Cadeira Escolar"
								/>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<InputField
										label="Quantidade em Estoque"
										name="availableQuantity"
										type="number"
										min="0"
										value={formData.availableQuantity}
										onChange={handleChange}
										required
									/>

									<InputField
										label="Custo Logístico Unitário (R$)"
										name="unitLogisticCost"
										type="number"
										min="0"
										step="0.01"
										value={formData.unitLogisticCost}
										onChange={handleChange}
										required
									/>
								</div>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<InputField
										label="Categoria"
										name="category"
										value={formData.category}
										onChange={handleChange}
										placeholder="ex.: Escolar"
									/>
									<SelectField
										label="Fornecedor"
										name="idSupplier"
										value={formData.idSupplier}
										onChange={handleChange}
										options={supplierOptions}
										required
										placeholder="Selecionar Fornecedor"
									/>
								</div>

								{/* Price Tiers Section */}
								<div>
									<label className="block text-sm font-medium text-gray-700 mb-2">
										Preços <span className="text-red-500">*</span>
									</label>
									<div className="space-y-2 max-h-96 overflow-y-auto pr-2 border border-[#EEEEEE] rounded-md p-3">
										{formData.priceTiers.map((tier, index) => (
											<PriceTierRow
												key={index}
												tier={tier}
												index={index}
												onChange={handleTierChange}
												onRemove={removeTier}
												canRemove={formData.priceTiers.length > 1}
											/>
										))}
									</div>
									<button
										type="button"
										onClick={addTier}
										className="mt-2 text-sm text-[#777C6D] hover:text-[#5f6356] font-medium transition duration-150 ease-in-out flex items-center space-x-1"
									>
									 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
  										<path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
									</svg>
										<span>Adicionar Preço</span>
									</button>
								</div>

								<SelectField
									label="Status"
									name="productStatus"
									value={formData.productStatus}
									onChange={handleChange}
									options={statusSelectOptions}
									required
								/>

								<TextAreaField
									label="Descrição"
									name="description"
									value={formData.description}
									onChange={handleChange}
									placeholder="Detalhes do Produto..."
								/>

								{/* Modal Footer (Buttons) */}
								<div className="flex justify-end space-x-3 pt-4 border-t border-[#EEEEEE] mt-6">
									<button
										type="button"
										onClick={closeModal}
										className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out"
									>
										Cancelar
									</button>
									<button
										type="submit"
										className="bg-[#777C6D] hover:bg-[#5f6356] text-white font-semibold py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out"
									>
										{selectedProduct ? 'Atualizar Produto' : 'Salvar Produto'}
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

export default Product;