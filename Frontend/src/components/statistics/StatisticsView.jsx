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


	const today = new Date();
	today.setHours(0, 0, 0, 0);

	// Build an array of the last 7 days
	const last7Days = [...Array(7)].map((_, i) => {
		const d = new Date(today);
		d.setDate(today.getDate() - (6 - i));
		return d;
	});

	// Map day string to number of transactions (used for Transaction Velocity)
	const dailyCounts = last7Days.map((day) => {
		const dayStart = new Date(day);
		const dayEnd = new Date(day);
		dayEnd.setDate(dayEnd.getDate() + 1);

		const count = transactions.filter((tx) => {
			const txDate = new Date(tx.createdAt);
			return txDate >= dayStart && txDate < dayEnd;
		}).length;

		return count;
	});

	// Used for the Average Transaction graph
	const dailyAverages = last7Days.map((day) => {
		const dayStart = new Date(day);
		const dayEnd = new Date(day);
		dayEnd.setDate(dayEnd.getDate() + 1);

		const dayTransactions = transactions.filter((tx) => {
			const txDate = new Date(tx.createdAt);
			return txDate >= dayStart && txDate < dayEnd;
		});

		if (dayTransactions.length === 0) return 0;

		const total = dayTransactions.reduce((sum, tx) => sum + tx.amount, 0);
		return total / dayTransactions.length;
	});

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
			trend: averageTransactionAmount < 1000 ? "up" : "down",
			trendColor:
				averageTransactionAmount < 1000 ? "text-emerald-600" : "text-rose-600",
			isPositive: averageTransactionAmount < 1000,
			chartType: "line",
			chartData: {
				labels: last7Days.map((d) =>
					d.toLocaleString("en-US", { weekday: "short" })
				),
				datasets: [
					{
						label: "Average Amount",
						data: dailyAverages,
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
				labels: last7Days.map((d) =>
					d.toLocaleString("en-US", { weekday: "short" })
				),
				datasets: [
					{
						label: "Transactions",
						data: dailyCounts,
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
		<div
			className="flex flex-col h-full"
		>
			<h2 className="text-xl font-semibold text-gray-900 mb-6">
				Overall Statistics
			</h2>
			<div className="flex-grow overflow-y-auto p-6">
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
		</div>
	);
}
