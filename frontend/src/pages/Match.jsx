import React, { useState, useEffect } from 'react';
import { useBidding } from '../hooks/bidding/useBidding'; // To get the list of biddings
import { useMatch } from '../hooks/match/useMatch';   // To fetch and display matches

const Match = () => {
	// Get biddings list and loading state from Bidding context
	const { biddings, loading: biddingsLoading, error: biddingsError } = useBidding();

	// Get matches, loading state, error, and fetch function from Match context
	const { matches, loading: matchesLoading, error: matchesError, fetchMatches } = useMatch();

	// State to hold the ID of the selected bidding
	const [selectedBiddingId, setSelectedBiddingId] = useState('');

	// Handle selection change in the dropdown
	const handleBiddingSelect = (event) => {
		const newBiddingId = event.target.value;
		setSelectedBiddingId(newBiddingId);
	};

	// Trigger fetchMatches when selectedBiddingId changes
	useEffect(() => {
		if (selectedBiddingId) {
			fetchMatches(selectedBiddingId);
		} else {
			// Optionally clear matches if no bidding is selected
			// fetchMatches(null); // MatchProvider already handles clearing
		}
	}, [selectedBiddingId, fetchMatches]); // Re-run effect if ID or function changes

	// Display loading state for biddings
	if (biddingsLoading) {
		return <div className="text-center p-10">Loading biddings...</div>;
	}

	// Display error if fetching biddings failed
	if (biddingsError) {
		return <div className="text-red-500 text-center p-10">Error loading biddings: {biddingsError}</div>;
	}

	// Find the selected bidding object (for displaying info)
	const selectedBidding = biddings.find(b => b.idBidding === selectedBiddingId);

	return (
		<div className="container mx-auto">
			{/* Title */}
			<h1 className="text-3xl font-bold text-gray-800 mb-6">Find Matches for Bidding</h1>

			{/* Bidding Selection Dropdown */}
			<div className="mb-6">
				<label htmlFor="biddingSelect" className="block text-sm font-medium text-gray-700 mb-2">
					Select a Bidding Request:
				</label>
				<select
					id="biddingSelect"
					value={selectedBiddingId}
					onChange={handleBiddingSelect}
					className="block w-full max-w-md px-3 py-2 border border-[#CBCBCB] rounded-md shadow-sm bg-white focus:outline-none focus:ring-[#777C6D] focus:border-[#777C6D]"
				>
					<option value="">-- Select Bidding --</option>
					{biddings.map(bidding => (
						<option key={bidding.idBidding} value={bidding.idBidding}>
							{bidding.name} (Product: {bidding.productBidding})
						</option>
					))}
				</select>
			</div>

			{/* Display selected bidding details (optional but helpful) */}
			{selectedBidding && (
				<div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
					<h3 className="text-lg font-semibold text-blue-800">Selected Bidding Details</h3>
					<p className="text-sm text-gray-700"><strong>Product Needed:</strong> {selectedBidding.productBidding}</p>
					<p className="text-sm text-gray-700"><strong>Category:</strong> {selectedBidding.category}</p>
					<p className="text-sm text-gray-700"><strong>Quantity:</strong> {selectedBidding.quantity}</p>
				</div>
			)}


			{/* Match Results Section */}
			{selectedBiddingId && ( // Only show results section if a bidding is selected
				<div>
					<h2 className="text-2xl font-bold text-gray-800 mb-4">Top 3 Matches Found</h2>

					{/* Loading state for matches */}
					{matchesLoading && <div className="text-center p-10">Finding matches...</div>}

					{/* Error state for matches */}
					{matchesError && <div className="text-red-500 text-center p-10">Error finding matches: {matchesError}</div>}

					{/* Matches Table (only if not loading and no error) */}
					{!matchesLoading && !matchesError && (
						<div className="bg-[#FFFFFF] shadow-md rounded-lg overflow-hidden">
							<table className="min-w-full divide-y divide-[#CBCBCB]">
								<thead className="bg-[#EEEEEE]">
									<tr>
										<th className="py-3 px-4 text-left text-sm font-semibold text-[#777C6D] uppercase">Rank</th>
										<th className="py-3 px-4 text-left text-sm font-semibold text-[#777C6D] uppercase">Product Name</th>
										<th className="py-3 px-4 text-left text-sm font-semibold text-[#777C6D] uppercase">Supplier</th>
										<th className="py-3 px-4 text-left text-sm font-semibold text-[#777C6D] uppercase">Price/Unit (R$)</th>
										<th className="py-3 px-4 text-left text-sm font-semibold text-[#777C6D] uppercase">Total Cost (R$)</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-[#EEEEEE]">
									{matches.length === 0 ? (
										<tr>
											<td colSpan="5" className="text-center py-6 text-gray-500">No suitable matches found for this bidding.</td>
										</tr>
									) : (
										matches.map((match, index) => (
											<tr key={match.productId} className="hover:bg-gray-50">
												<td className="py-4 px-4 font-semibold">{index + 1}</td>
												<td className="py-4 px-4">{match.productName}</td>
												<td className="py-4 px-4">{match.supplierName}</td>
												<td className="py-4 px-4">{match.pricePerUnit.toFixed(2)}</td>
												<td className="py-4 px-4 font-bold text-[#777C6D]">{match.totalCost.toFixed(2)}</td>
											</tr>
										))
									)}
								</tbody>
							</table>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default Match;