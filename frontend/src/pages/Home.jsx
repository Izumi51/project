import React from 'react';
import { Link } from 'react-router'
import { useBidding } from '../hooks/bidding/useBidding';
import { useProduct } from '../hooks/product/useProduct';
import { useSupplier } from '../hooks/supplier/useSupplier';

// --- Dashboard Card Component ---
const DashboardCard = ({ title, value, linkTo, bgColor = 'bg-[#777C6D]', isLoading }) => (
	<Link
		to={linkTo}
		className={`block p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ${bgColor} text-white`}
	>
		<div className="flex items-center justify-between">
			<p className="text-sm uppercase tracking-wider opacity-80">{title}</p>
			{isLoading ? (
				// Skeleton loader for value
				<div className="h-8 w-16 bg-gray-300 animate-pulse rounded mt-1"></div>
			) : (
				<p className="text-3xl font-bold">{value}</p>
			)}
		</div>
	</Link>
);

// --- Recent List Item Component ---
const RecentListItem = ({ item, linkTo }) => (
	<Link to={linkTo} className="block hover:bg-gray-100 p-3 rounded-md transition-colors duration-150">
		<div className="flex justify-between items-center">
			<div>
				<p className="text-sm font-medium text-gray-800">{item.name}</p>
				<p className="text-xs text-gray-500">{item.subText}</p>
			</div>
			<span className="text-xs text-[#777C6D] font-semibold">{item.status}</span>
		</div>
	</Link>
);


const Home = () => {
	const { biddings, loading: biddingsLoading, error: biddingsError } = useBidding();
	const { products, loading: productsLoading, error: productsError } = useProduct();
	const { suppliers, loading: suppliersLoading, error: suppliersError } = useSupplier();

	// Combine loading and error states
	const isLoading = biddingsLoading || productsLoading || suppliersLoading;
	const fetchError = biddingsError || productsError || suppliersError;

	// Get the last 3 biddings (or fewer if there aren't 3)
	const recentBiddings = biddings
		.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate)) // Sort by date (most recent first)
		.slice(0, 3)
		.map(b => ({ // Format for the RecentListItem component
			id: b.idBidding,
			name: b.name,
			subText: `Product: ${b.productBidding} | Qty: ${b.quantity}`,
			status: b.biddingStatus
		}));

	return (
		<div className="container mx-auto p-4 md:p-6">
			{/* Header */}
			<div className="mb-8 pb-4 border-b border-[#CBCBCB]">
				<h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
				<p className="text-gray-500 mt-1">Overview of your procurement activities.</p>
			</div>

			{/* Display error, if any */}
			{fetchError && !isLoading && (
				<div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md text-center" role="alert">
					Error loading dashboard data: {fetchError}
				</div>
			)}

			{/* Summary Cards Grid */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
				<DashboardCard
					title="Total Biddings"
					value={biddings.length}
					linkTo="/bidding"
					isLoading={isLoading}
				/>
				<DashboardCard
					title="Total Products"
					value={products.length}
					linkTo="/product"
					bgColor="bg-[#B7B89F]"
					isLoading={isLoading}
				/>
				<DashboardCard
					title="Total Suppliers"
					value={suppliers.length}
					linkTo="/supplier"
					bgColor="bg-gray-500"
					isLoading={isLoading}
				/>
			</div>

			{/* Recent Biddings Section */}
			<div className="bg-white shadow-md rounded-lg border border-gray-200">
				<div className="p-5 border-b border-gray-200">
					<h2 className="text-xl font-semibold text-gray-800">Recent Biddings</h2>
				</div>
				<div className="p-3">
					{isLoading ? (
						<div className="space-y-2 p-2">
							{/* Skeleton loaders */}
							<div className="h-10 bg-gray-200 animate-pulse rounded"></div>
							<div className="h-10 bg-gray-200 animate-pulse rounded"></div>
							<div className="h-10 bg-gray-200 animate-pulse rounded"></div>
						</div>
					) : recentBiddings.length > 0 ? (
						<div className="divide-y divide-gray-100">
							{recentBiddings.map(bidding => (
								<RecentListItem
									key={bidding.id}
									item={bidding}
									linkTo="/bidding" // Could lead to a specific detail page in the future
								/>
							))}
						</div>
					) : (
						<p className="text-center text-gray-500 py-6">No recent biddings found.</p>
					)}
				</div>
				<div className="p-4 bg-gray-50 border-t border-gray-200 text-right">
					<Link to="/bidding" className="text-sm font-medium text-[#777C6D] hover:text-[#5f6356] hover:underline">
						View All Biddings &rarr;
					</Link>
				</div>
			</div>
		</div>
	);
};

export default Home;