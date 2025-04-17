import React from "react";
import { ArrowUpFromLine, ArrowDownToLine, Repeat } from "lucide-react";

export default function Statistics({
	totalTransactions,
	depositsCount,
	withdrawalsCount,
	transfersCount,
}) {
	const stats = [
		{
			label: "Total Transactions",
			value: totalTransactions,
			icon: Repeat,
			color: "bg-purple-100 text-purple-600",
		},
		{
			label: "Deposits",
			value: depositsCount,
			icon: ArrowDownToLine,
			color: "bg-green-100 text-green-600",
		},
		{
			label: "Withdrawals",
			value: withdrawalsCount,
			icon: ArrowUpFromLine,
			color: "bg-red-100 text-red-600",
		},
		{
			label: "Transfers",
			value: transfersCount,
			icon: Repeat,
			color: "bg-blue-100 text-blue-600",
		},
	];

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
			{stats.map((stat) => (
				<div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm">
					<div className="flex items-center gap-4">
						<div className={`p-3 rounded-lg ${stat.color}`}>
							<stat.icon className="w-6 h-6" />
						</div>
						<div>
							<p className="text-sm text-gray-600">{stat.label}</p>
							<p className="text-2xl font-semibold text-gray-900">
								{stat.value.toLocaleString()}
							</p>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
