import React from "react";
import { ArrowDownToLine, ArrowUpFromLine, Send } from "lucide-react";

export default function TransactionList({ transactions, wallets }) {
	const getWalletName = (id) => {
		return wallets.find((w) => w.id == id)?.name || "Unknown Wallet";
	};

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

	return (
		<div className="space-y-4">
			<h2 className="text-xl font-semibold text-gray-900">
				Recent Transactions
			</h2>
			<div className="bg-white rounded-xl shadow-sm overflow-hidden">
				{transactions.length === 0 ? (
					<div className="p-6 text-center text-gray-500">
						No transactions yet
					</div>
				) : (
					<ul className="divide-y divide-gray-200">
						{transactions.map((transaction) => {
							const Icon = icons[transaction.type];
							const colorClass = colors[transaction.type];

							return (
								<li key={transaction.id} className="p-4 hover:bg-gray-50">
									<div className="flex items-center gap-4">
										<div className={`p-2 rounded-lg ${colorClass}`}>
											<Icon className="w-5 h-5" />
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-gray-900">
												{transaction.type === "transfer"
													? `Transfer to ${getWalletName(
															transaction.recipientWalletId
														)}`
													: `${
															transaction.type.charAt(0).toUpperCase() +
															transaction.type.slice(1)
														}`}
											</p>
											<p className="text-sm text-gray-500">
												From {getWalletName(transaction.walletId)}
											</p>
											<p className="text-xs text-gray-400">
												{transaction.description}
											</p>
										</div>
										<div className="text-right">
											<p
												className={`text-sm font-medium ${
													transaction.type === "deposit"
														? "text-green-600"
														: "text-red-600"
												}`}
											>
												{transaction.type === "deposit" ? "+" : "-"}$
												{transaction.amount.toFixed(2)}
											</p>
											<p className="text-xs text-gray-400">
												{new Date(transaction.createdAt).toLocaleDateString()}
											</p>
										</div>
									</div>
								</li>
							);
						})}
					</ul>
				)}
			</div>
		</div>
	);
}
