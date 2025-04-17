import React, { useState } from "react";
import {
	CreditCard,
	ArrowUpFromLine,
	ArrowDownToLine,
	Repeat,
	Calculator,
	TrendingUp,
	ChevronUp,
	ChevronDown,
	Activity,
} from "lucide-react";

import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend,
} from "chart.js";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	BarElement,
	ArcElement,
	Title,
	Tooltip,
	Legend
);

export default function StatisticsView({ transactions, wallets }) {
	const [selectedCard, setSelectedCard] = useState("all");

	const totalTransactions = transactions.length;
	const deposits = transactions.filter((t) => t.type === "deposit");
	const withdrawals = transactions.filter((t) => t.type === "withdrawal");
	const transfers = transactions.filter((t) => t.type === "transfer");

	const depositsCount = deposits.length;
	const withdrawalsCount = withdrawals.length;
	const transfersCount = transfers.length;

	const depositsRatio = totalTransactions
		? depositsCount / totalTransactions
		: 0;
	const withdrawalsRatio = totalTransactions
		? withdrawalsCount / totalTransactions
		: 0;
	const transfersRatio = totalTransactions
		? transfersCount / totalTransactions
		: 0;

	const totalDepositsAmount = deposits.reduce((sum, t) => sum + t.amount, 0);
	const totalWithdrawalsAmount = withdrawals.reduce(
		(sum, t) => sum + t.amount,
		0
	);
	const withdrawalToDepositRatio = totalDepositsAmount
		? totalWithdrawalsAmount / totalDepositsAmount
		: 0;
	const averageTransactionAmount =
		depositsCount + withdrawalsCount
			? (totalDepositsAmount + totalWithdrawalsAmount) /
				(depositsCount + withdrawalsCount)
			: 0;

	const uniqueDays = new Set(
		transactions.map((t) => new Date(t.createdAt).toISOString().split("T")[0])
	).size;
	const transactionsPerDay = uniqueDays ? totalTransactions / uniqueDays : 0;

	const generalStats = [
		{
			label: "Deposits Ratio",
			value: `${(depositsRatio * 100).toFixed(1)}%`,
			description: "Proportion of deposits in total transactions",
			icon: ArrowDownToLine,
			color: "bg-emerald-50",
			textColor: "text-emerald-600",
			trend: depositsRatio > 0.3 ? "up" : "down",
			trendColor: depositsRatio > 0.3 ? "text-emerald-600" : "text-rose-600",
			isPositive: depositsRatio > 0.3,
			chartType: "doughnut",
			chartData: {
				labels: ["Deposits", "Other Transactions"],
				datasets: [
					{
						data: [depositsCount, totalTransactions - depositsCount],
						backgroundColor: ["#34d399", "#f1f5f9"],
						borderColor: ["#10b981", "#e2e8f0"],
						borderWidth: 1,
					},
				],
			},
			chartOptions: {
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: "bottom",
						labels: { padding: 20, color: "#64748b" },
					},
				},
			},
		},
		{
			label: "Withdrawals Ratio",
			value: `${(withdrawalsRatio * 100).toFixed(1)}%`,
			description: "Proportion of withdrawals in total transactions",
			icon: ArrowUpFromLine,
			color: "bg-rose-50",
			textColor: "text-rose-600",
			trend: withdrawalsRatio < 0.4 ? "up" : "down",
			trendColor: withdrawalsRatio < 0.4 ? "text-emerald-600" : "text-rose-600",
			isPositive: withdrawalsRatio < 0.4,
			chartType: "doughnut",
			chartData: {
				labels: ["Withdrawals", "Other Transactions"],
				datasets: [
					{
						data: [withdrawalsCount, totalTransactions - withdrawalsCount],
						backgroundColor: ["#fb7185", "#f1f5f9"],
						borderColor: ["#e11d48", "#e2e8f0"],
						borderWidth: 1,
					},
				],
			},
			chartOptions: {
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: "bottom",
						labels: { padding: 20, color: "#64748b" },
					},
				},
			},
		},
		{
			label: "Transfers Ratio",
			value: `${(transfersRatio * 100).toFixed(1)}%`,
			description: "Proportion of transfers in total transactions",
			icon: Repeat,
			color: "bg-sky-50",
			textColor: "text-sky-600",
			trend: transfersRatio > 0.2 ? "up" : "down",
			trendColor: transfersRatio > 0.2 ? "text-emerald-600" : "text-rose-600",
			isPositive: transfersRatio > 0.2,
			chartType: "doughnut",
			chartData: {
				labels: ["Transfers", "Other Transactions"],
				datasets: [
					{
						data: [transfersCount, totalTransactions - transfersCount],
						backgroundColor: ["#38bdf8", "#f1f5f9"],
						borderColor: ["#0284c7", "#e2e8f0"],
						borderWidth: 1,
					},
				],
			},
			chartOptions: {
				maintainAspectRatio: false,
				plugins: {
					legend: {
						position: "bottom",
						labels: { padding: 20, color: "#64748b" },
					},
				},
			},
		},
		{
			label: "Withdrawal/Deposit Ratio",
			value: `${(withdrawalToDepositRatio * 100).toFixed(1)}%`,
			description: "Balance between withdrawals and deposits",
			icon: Calculator,
			color: "bg-violet-50",
			textColor: "text-violet-600",
			trend: withdrawalToDepositRatio < 0.8 ? "up" : "down",
			trendColor:
				withdrawalToDepositRatio < 0.8 ? "text-emerald-600" : "text-rose-600",
			isPositive: withdrawalToDepositRatio < 0.8,
			chartType: "bar",
			chartData: {
				labels: ["Deposits", "Withdrawals"],
				datasets: [
					{
						label: "Amount",
						data: [totalDepositsAmount, totalWithdrawalsAmount],
						backgroundColor: ["#a5b4fc", "#fda4af"],
						borderColor: ["#818cf8", "#fb7185"],
						borderWidth: 1,
						borderRadius: 8,
					},
				],
			},
			chartOptions: {
				maintainAspectRatio: false,
				plugins: { legend: { display: false } },
				scales: {
					y: {
						beginAtZero: true,
						grid: { color: "#f1f5f9" },
						ticks: { color: "#64748b" },
					},
					x: {
						grid: { display: false },
						ticks: { color: "#64748b" },
					},
				},
			},
		},
		{
			label: "Average Transaction",
			value: new Intl.NumberFormat("en-US", {
				style: "currency",
				currency: "USD",
			}).format(averageTransactionAmount),
			description: "Average amount per transaction over time",
			icon: TrendingUp,
			color: "bg-indigo-50",
			textColor: "text-indigo-600",
			trend: averageTransactionAmount > 1000 ? "up" : "down",
			trendColor:
				averageTransactionAmount > 1000 ? "text-emerald-600" : "text-rose-600",
			isPositive: averageTransactionAmount > 1000,
			chartType: "line",
			chartData: {
				labels: [...Array(7)].map((_, i) => {
					const d = new Date();
					d.setDate(d.getDate() - (6 - i));
					return d.toLocaleDateString("en-US", { weekday: "short" });
				}),
				datasets: [
					{
						label: "Average Amount",
						data: [...Array(7)].map(() => Math.random() * 1000 + 500),
						borderColor: "#818cf8",
						backgroundColor: "#a5b4fc20",
						tension: 0.4,
						fill: true,
					},
				],
			},
			chartOptions: {
				maintainAspectRatio: false,
				plugins: { legend: { display: false } },
				scales: {
					y: {
						beginAtZero: true,
						grid: { color: "#f1f5f9" },
						ticks: { color: "#64748b" },
					},
					x: {
						grid: { display: false },
						ticks: { color: "#64748b" },
					},
				},
			},
		},
		{
			label: "Transaction Velocity",
			value: transactionsPerDay.toFixed(1),
			description: "Average number of transactions per day",
			icon: Activity,
			color: "bg-amber-50",
			textColor: "text-amber-600",
			trend: transactionsPerDay > 2 ? "up" : "down",
			trendColor: transactionsPerDay > 2 ? "text-emerald-600" : "text-rose-600",
			isPositive: transactionsPerDay > 2,
			chartType: "line",
			chartData: {
				labels: [...Array(7)].map((_, i) => {
					const d = new Date();
					d.setDate(d.getDate() - (6 - i));
					return d.toLocaleDateString("en-US", { weekday: "short" });
				}),
				datasets: [
					{
						label: "Transactions",
						data: [...Array(7)].map(() => Math.floor(Math.random() * 5) + 1),
						borderColor: "#fbbf24",
						backgroundColor: "#fcd34d20",
						tension: 0.4,
						fill: true,
					},
				],
			},
			chartOptions: {
				maintainAspectRatio: false,
				plugins: { legend: { display: false } },
				scales: {
					y: {
						beginAtZero: true,
						ticks: { stepSize: 1, color: "#64748b" },
						grid: { color: "#f1f5f9" },
					},
					x: {
						grid: { display: false },
						ticks: { color: "#64748b" },
					},
				},
			},
		},
	];

	return (
		<div className="h-full flex flex-col">
			<div
				className="flex-none p-6 bg-white border-b overflow-y-auto"
				style={{ maxHeight: "calc(100vh - 12rem)" }}
			>
				<h2 className="text-xl font-semibold text-gray-900 mb-6">
					Overall Statistics
				</h2>
				<div className="grid grid-cols-2 gap-6">
					{generalStats.map((stat, index) => (
						<div key={index} className="bg-white p-6 rounded-xl shadow-sm">
							<div className="flex flex-col h-full">
								<div className="flex items-center gap-4 mb-4">
									<div
										className={`p-3 rounded-lg ${stat.color} ${stat.textColor}`}
									>
										<stat.icon className="w-6 h-6" />
									</div>
									<div>
										<h3 className="font-medium text-gray-900">{stat.label}</h3>
										<p className="text-sm text-gray-500">{stat.description}</p>
									</div>
								</div>
								<div className="flex items-center gap-2 mb-4">
									<p className={`text-2xl font-semibold ${stat.textColor}`}>
										{stat.value}
									</p>
									{stat.trend === "up" ? (
										<ChevronUp className={`w-5 h-5 ${stat.trendColor}`} />
									) : (
										<ChevronDown className={`w-5 h-5 ${stat.trendColor}`} />
									)}
									<span className={`text-sm ${stat.trendColor}`}>
										{stat.isPositive ? "Positive Trend" : "Needs Attention"}
									</span>
								</div>
								<div className="h-48 flex-grow">
									{stat.chartType === "line" && (
										<Line data={stat.chartData} options={stat.chartOptions} />
									)}
									{stat.chartType === "bar" && (
										<Bar data={stat.chartData} options={stat.chartOptions} />
									)}
									{stat.chartType === "pie" && (
										<Pie data={stat.chartData} options={stat.chartOptions} />
									)}
									{stat.chartType === "doughnut" && (
										<Doughnut
											data={stat.chartData}
											options={stat.chartOptions}
										/>
									)}
								</div>
							</div>
						</div>
					))}
				</div>
			</div>

			<div className="flex-1 flex">
				<div className="w-1/3 bg-gray-50 p-6 border-r overflow-y-auto">
					<h3 className="text-lg font-semibold text-gray-900 mb-4">
						Select Card
					</h3>
					<div className="space-y-3">
						{wallets.map((wallet) => (
							<button
								key={wallet.id}
								onClick={() => setSelectedCard(wallet.id)}
								className={`w-full flex items-center gap-3 p-4 rounded-lg transition-all ${
									selectedCard === wallet.id
										? "bg-blue-500 text-white shadow-md"
										: "bg-white text-gray-900 hover:bg-gray-100"
								}`}
							>
								<CreditCard className="w-5 h-5" />
								<div className="text-left">
									<p className="font-medium">{wallet.name}</p>
									<p
										className={`text-sm ${
											selectedCard === wallet.id
												? "text-blue-100"
												: "text-gray-500"
										}`}
									>
										{new Intl.NumberFormat("en-US", {
											style: "currency",
											currency: "USD",
										}).format(wallet.balance)}
									</p>
								</div>
							</button>
						))}
					</div>
				</div>

				<div className="w-2/3 bg-white p-6 overflow-y-auto">
					<div className="flex items-center justify-between mb-6">
						<h3 className="text-lg font-semibold text-gray-900">
							{selectedCard === "all"
								? "Select a Card"
								: wallets.find((w) => w.id === selectedCard)?.name + " Metrics"}
						</h3>
					</div>
					{selectedCard === "all" ? (
						<div className="flex items-center justify-center h-64 text-gray-500">
							Select a card to view its metrics
						</div>
					) : (
						<div className="space-y-6">
							{/* Future card-specific metrics section */}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
