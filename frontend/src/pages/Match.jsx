import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router'; 
import { useBidding } from '../hooks/bidding/useBidding'; 
import { useMatch } from '../hooks/match/useMatch';   

const Match = () => {
	// Get biddings list and loading state from Bidding context
	const { biddings, loading: biddingsLoading, error: biddingsError } = useBidding();

	// Get matches, loading state, error, and fetch function from Match context
	const { matches, loading: matchesLoading, error: matchesError, fetchMatches } = useMatch();

	// State to hold the ID of the selected bidding
	const [selectedBiddingId, setSelectedBiddingId] = useState('');

	const navigate = useNavigate(); // <-- 2. INICIAR O HOOK

	// Handle selection change in the dropdown
	const handleBiddingSelect = (event) => {
		const newBiddingId = event.target.value;
		setSelectedBiddingId(newBiddingId);
	};

	// Trigger fetchMatches when selectedBiddingId changes
	useEffect(() => {
		if (selectedBiddingId) {
			fetchMatches(selectedBiddingId);
		}
	}, [selectedBiddingId, fetchMatches]);

	// <-- 3. CRIAR FUNÇÃO DE NAVEGAÇÃO ---
	const handleCardClick = (productId, supplierId) => {
		navigate(`/match/${productId}/${supplierId}`);
	};

	// Display loading state for biddings
	if (biddingsLoading) {
		return <div className="text-center p-10 text-gray-600">Loading biddings...</div>;
	}

	// Display error if fetching biddings failed
	if (biddingsError) {
		return <div className="text-red-600 text-center p-10">Error loading biddings: {biddingsError}</div>;
	}

	// Find the selected bidding object (for displaying info)
	const selectedBidding = biddings.find(b => b.idBidding === selectedBiddingId);

	return (
		<div className="container mx-auto p-4 md:p-6">

			{/* Cabeçalho */}
			<div className="flex justify-between items-center mb-6 pb-4 border-b border-[#CBCBCB]">
				<h1 className="text-2xl md:text-3xl font-bold text-gray-800">Find Matches</h1>
			</div>

			{/* Bidding Selection Dropdown */}
			<div className="mb-6 bg-white shadow-md rounded-lg p-6 border border-gray-200">
				<label htmlFor="biddingSelect" className="block text-lg font-semibold text-gray-800 mb-3">
					Select a Bidding Request
				</label>
				<p className="text-sm text-gray-500 mb-4">Choose one of your active biddings to find the best supplier matches.</p>
				<select
					id="biddingSelect"
					value={selectedBiddingId}
					onChange={handleBiddingSelect}
					className="block w-full max-w-lg px-4 py-3 border border-[#CBCBCB] rounded-md shadow-sm bg-white focus:outline-none focus:ring-[#777C6D] focus:border-[#777C6D] transition duration-150 ease-in-out"
				>
					<option value="">-- Select Bidding --</option>
					{biddings.map(bidding => (
						<option key={bidding.idBidding} value={bidding.idBidding}>
							{bidding.name} (Product: {bidding.productBidding})
						</option>
					))}
				</select>
			</div>

			{/* Display selected bidding details */}
			{selectedBidding && (
				<div className="mb-8 p-5 bg-white shadow-md rounded-lg border border-gray-200">
					<div className="flex items-center border-b border-gray-200 pb-3 mb-3">
						<h3 className="text-lg font-semibold text-gray-800">Selected Bidding Details</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
						<div>
							<span className="text-gray-500 block">Product Needed:</span>
							<span className="text-gray-900 font-medium">{selectedBidding.productBidding}</span>
						</div>
						<div>
							<span className="text-gray-500 block">Category:</span>
							<span className="text-gray-900 font-medium">{selectedBidding.category}</span>
						</div>
						<div>
							<span className="text-gray-500 block">Quantity:</span>
							<span className="text-gray-900 font-medium">{selectedBidding.quantity} units</span>
						</div>
					</div>
				</div>
			)}


			{/* Match Results Section */}
			{selectedBiddingId && (
				<div>
					<h2 className="text-2xl font-bold text-gray-800 mb-5">Top Matches Found</h2>

					{/* Loading state for matches */}
					{matchesLoading && <div className="text-center p-10 text-gray-600">Finding matches...</div>}

					{/* Error state for matches */}
					{matchesError &&
						<div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-md shadow-md" role="alert">
							<p className="font-bold">Error finding matches</p>
							<p>{matchesError}</p>
						</div>
					}

					{!matchesLoading && !matchesError && (
						<>
							{matches.length === 0 ? (
								<div className="bg-white shadow-md rounded-lg p-10 text-center text-gray-500">
									<h3 className="text-lg font-medium">No Suitable Matches Found</h3>
									<p className="mt-2 text-sm">We couldn't find any products that match your bidding criteria (Category, Product Name, and Status: SELLING).</p>
								</div>
							) : (
								<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
									{matches.map((match, index) => (
										<div
											key={match.productId}
											className={`bg-white shadow-lg rounded-lg overflow-hidden transition-all duration-300 group cursor-pointer hover:shadow-xl hover:-translate-y-1 ${index === 0 ? 'border-2 border-[#777C6D]' : 'border border-gray-200'}`}
											onClick={() => handleCardClick(match.productId, match.supplierId)}
										>
											{/* Card Header: Rank and Product */}
											<div className="p-5 border-b border-gray-200">
												<span
													className={`inline-block text-sm font-bold px-3 py-1 rounded-full mb-3 ${index === 0 ? 'bg-[#777C6D] text-white' : 'bg-gray-200 text-gray-700'}`}
												>
													Rank #{index + 1} {index === 0 && '(Best Match)'}
												</span>
												<h3 className="text-xl font-bold text-gray-900 truncate group-hover:text-[#777C6D] transition-colors" title={match.productName}>
													{match.productName}
												</h3>
												<p className="text-sm text-gray-500 mt-1">
													from <span className="font-medium text-gray-600">{match.supplierName}</span>
												</p>
											</div>

											{/* Card Body: Costs */}
											<div className="p-5 bg-gray-50">
												<div className="flex justify-between items-center mb-2">
													<span className="text-sm text-gray-600">Price / Unit:</span>
													<span className="text-sm font-medium text-gray-800">R$ {match.pricePerUnit.toFixed(2)}</span>
												</div>
												<div className="flex justify-between items-center mb-4">
													<span className="text-sm text-gray-600">Bidding Quantity:</span>
													<span className="text-sm font-medium text-gray-800">{match.biddingQuantity} units</span>
												</div>

												{/* Total Cost Highlight */}
												<div className="text-center mt-4 pt-4 border-t border-gray-200">
													<p className="text-sm text-gray-500 uppercase">Total Cost</p>
													<p className={`text-3xl font-bold ${index === 0 ? 'text-[#777C6D]' : 'text-gray-800'}`}>
														R$ {match.totalCost.toFixed(2)}
													</p>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</>
					)}
				</div>
			)}
		</div>
	);
};

export default Match;