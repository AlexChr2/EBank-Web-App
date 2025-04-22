import React, { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Send } from "lucide-react";

export default function TransactionHistory({ transactions, wallets }) {
	const [filterType, setFilterType] = useState("all");
	const [sourceWalletId, setSourceWalletId] = useState("");
	const [recipientWalletId, setRecipientWalletId] = useState("");
	const [minAmount, setMinAmount] = useState("");
	const [maxAmount, setMaxAmount] = useState("");

	const getWalletName = (id) =>
		wallets.find((w) => w.id == id)?.name || "Unknown Card";

	const icons = {
		deposit: ArrowDownToLine,
		withdrawal: ArrowUpFromLine,
		transfer: Send,
	};

	const colors = {
		deposit: "text-green-600 bg-green-100",
		withdrawal: "text-red-600 bg-red-100",
		transfer: "text-blue-600 bg-blue-100",
	};

	const filteredTransactions = transactions.filter((transaction) => {
		if (filterType !== "all" && transaction.type !== filterType) return false;
		if (sourceWalletId && transaction.walletId != sourceWalletId) return false;
		if (
			filterType === "transfer" &&
			recipientWalletId &&
			transaction.recipientWalletId != recipientWalletId
		)
			return false;

		const numMin = minAmount ? parseFloat(minAmount) : null;
		const numMax = maxAmount ? parseFloat(maxAmount) : null;

		if (numMin !== null && transaction.amount < numMin) return false;
		if (numMax !== null && transaction.amount > numMax) return false;

		return true;
	});

	const handleReset = () => {
		setFilterType("all");
		setSourceWalletId("");
		setRecipientWalletId("");
		setMinAmount("");
		setMaxAmount("");
	};

	return (
		<div className="h-full flex">
			{/* Filters */}
			<div className="w-[40%] border-r bg-gray-50 p-6 overflow-y-auto">
				<div className="space-y-6">
					<div className="flex justify-between items-center">
						<h3 className="text-lg font-semibold text-gray-900">Filters</h3>
						<button
							onClick={handleReset}
							className="text-sm text-blue-600 hover:text-blue-700"
						>
							Reset All
						</button>
					</div>

					<div className="space-y-4">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Transaction Type
							</label>
							<div className="flex flex-col gap-2">
								{["all", "deposit", "withdrawal", "transfer"].map((type) => (
									<button
										key={type}
										onClick={() => setFilterType(type)}
										className={`px-4 py-2 rounded-lg capitalize text-left ${
											filterType === type
												? "bg-blue-600 text-white"
												: "bg-white text-gray-600 hover:bg-gray-100"
										}`}
									>
										{type === "all" ? "All" : type}
									</button>
								))}
							</div>
						</div>

						<div>
							<label
								htmlFor="sourceWallet"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Source Card
							</label>
							<select
								id="sourceWallet"
								value={sourceWalletId}
								onChange={(e) => setSourceWalletId(e.target.value)}
								className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							>
								<option value="">All Cards</option>
								{wallets.map((wallet) => (
									<option key={wallet.id} value={wallet.id}>
										{wallet.name}
									</option>
								))}
							</select>
						</div>

						{filterType === "transfer" && (
							<div>
								<label
									htmlFor="recipientWallet"
									className="block text-sm font-medium text-gray-700 mb-2"
								>
									Recipient Card
								</label>
								<select
									id="recipientWallet"
									value={recipientWalletId}
									onChange={(e) => setRecipientWalletId(e.target.value)}
									className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								>
									<option value="">All Cards</option>
									{wallets
										.filter((w) => w.id !== sourceWalletId)
										.map((wallet) => (
											<option key={wallet.id} value={wallet.id}>
												{wallet.name}
											</option>
										))}
								</select>
							</div>
						)}

						<div>
							<label
								htmlFor="minAmount"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Minimum Amount
							</label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
									$
								</span>
								<input
									id="minAmount"
									type="number"
									value={minAmount}
									onChange={(e) => setMinAmount(e.target.value)}
									className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									placeholder="0.00"
									step="0.01"
									min="0"
								/>
							</div>
						</div>

						<div>
							<label
								htmlFor="maxAmount"
								className="block text-sm font-medium text-gray-700 mb-2"
							>
								Maximum Amount
							</label>
							<div className="relative">
								<span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
									$
								</span>
								<input
									id="maxAmount"
									type="number"
									value={maxAmount}
									onChange={(e) => setMaxAmount(e.target.value)}
									className="w-full pl-8 pr-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									placeholder="0.00"
									step="0.01"
									min="0"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Transactions */}
			<div className="w-[60%] flex flex-col">
				<div className="p-6 border-b">
					<h2 className="text-xl font-semibold text-gray-900">
						Transaction History
					</h2>
				</div>

				<div className="flex-1 overflow-y-auto p-6">
					{filteredTransactions.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							No transactions found
						</div>
					) : (
						<div className="space-y-4">
							{filteredTransactions.map((transaction) => {
								const Icon = icons[transaction.type];
								const colorClass = colors[transaction.type];

								return (
									<div
										key={transaction.id}
										className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
									>
										<div className="flex items-center gap-4">
											<div className={`p-2 rounded-lg ${colorClass}`}>
												<Icon className="w-5 h-5" />
											</div>
											<div>
												<p className="font-medium text-gray-900">
													{transaction.type === "transfer"
														? `Transfer to ${getWalletName(
																transaction.recipientWalletId
															)}`
														: `${
																transaction.type.charAt(0).toUpperCase() +
																transaction.type.slice(1)
															}`}
												</p>
												<p className="text-sm text-gray-600">
													From {getWalletName(transaction.walletId)}
												</p>
												<p className="text-xs text-gray-500">
													{transaction.description}
												</p>
											</div>
										</div>
										<div className="text-right">
											<p
												className={`font-medium ${
													transaction.type === "deposit"
														? "text-green-600"
														: "text-red-600"
												}`}
											>
												{transaction.type === "deposit" ? "+" : "-"}
												{new Intl.NumberFormat("en-US", {
													style: "currency",
													currency: "USD",
												}).format(transaction.amount)}
											</p>
											<p className="text-xs text-gray-400">
												{new Date(transaction.createdAt).toLocaleDateString()}{" "}
												{new Date(transaction.createdAt).toLocaleTimeString()}
											</p>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
