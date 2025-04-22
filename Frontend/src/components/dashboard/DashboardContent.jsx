import React, { useState, useRef, useEffect } from "react";
import WalletList from "./WalletList";
import Statistics from "./Statistics";
import TransactionForm from "../transactions/TransactionForm";
import TransactionList from "../transactions/TransactionList";
import TransactionHistory from "../transactions/TransactionHistory";
import StatisticsView from "../statistics/StatisticsView";
import toast from "react-hot-toast";
import { createECard, deleteCard, getCards, getTransactions, makeTransaction, renameCard } from "../../ApiService";

export default function DashboardContent() {
	const [wallets, setWallets] = useState([]);
	const [transactions, setTransactions] = useState([]);
	const [showTransactionForm, setShowTransactionForm] = useState(false);
	const [transactionType, setTransactionType] = useState("deposit");
	const [currentView, setCurrentView] = useState("dashboard");
	const transactionRef = useRef(null);

	useEffect(() => {
		const restoreWallets = async() => {
			return await getCards()
				.then(data => {
						// add the currency to the wallet objects
						for (let i = 0; i < data.length; i++)
							data[i] = { ...data[i], currency: "USD" };
						setWallets([...wallets, ...data]);
					}
				).catch(error => {
					toast.error(`An error occured: ${error}`);
				});
		}

		const restoreTransactions = async() => {
			return await getTransactions()
				.then(data => {
					setTransactions(data);
				}).catch(error => {
					toast.error(`An error occured: ${error}`);
				});
		}
		restoreWallets();
		restoreTransactions();

		const handleShowTransactionForm = (event) => {
			const { type } = event.detail;
			setTransactionType(type);
			setShowTransactionForm(true);
			setCurrentView("dashboard");
			setTimeout(() => {
				transactionRef.current?.scrollIntoView({
					behavior: "smooth",
					block: "start",
				});
			}, 100);
		};

		const handleViewChange = (event) => {
			const { view } = event.detail;
			setCurrentView(view);
			setShowTransactionForm(false);
		};

		window.addEventListener("showTransactionForm", handleShowTransactionForm);
		window.addEventListener("changeView", handleViewChange);

		return () => {
			window.removeEventListener(
				"showTransactionForm",
				handleShowTransactionForm
			);
			window.removeEventListener("changeView", handleViewChange);
		};
	}, []);

	const handleCreateWallet = (name) => {
		createECard(name)
			.then((value) => {
				if (value.success) {
					const newWallet = {
						id: value.card_id,
						name,
						balance: 0,
						currency: "USD"
					}
					setWallets([...wallets, newWallet]);
					toast.success("Card created successfully!");
				}
			})
			.catch((msg) => {
				if (msg.error)
					toast.error(`An error occured: ${msg.error}`);
				else
					toast.error(`An error occured: ${msg}`);
			});
	};

	const handleDeleteWallet = (id) => {
		// delete the card from the backend. TODO: make this be awaited
		deleteCard(id);
		setWallets(wallets.filter((wallet) => wallet.id !== id));
		toast.success("Card deleted successfully!");
	};

	const handleUpdateWallet = (id, name) => {
		// update the backend information. TODO: make this be awaited and don't call
		// setWallets unless it was successful
		renameCard(id, name);
		setWallets(
			wallets.map((wallet) => (wallet.id == id ? { ...wallet, name } : wallet))
		);
		toast.success("Card updated successfully!");
	};

	const handleTransaction = (transaction) => {
		// add the transaction to the back-end. TODO: make this be awaited
		makeTransaction(
			transaction.type,
			transaction.walletId,
			transaction.recipientWalletId,
			transaction.amount,
			transaction.description
		).catch(error => console.log(error));
		setTransactions([transaction, ...transactions]);

		setWallets((currentWallets) => {
			return currentWallets.map((wallet) => {
				if (wallet.id == transaction.walletId) {
					const newBalance =
						transaction.type === "deposit"
							? wallet.balance + transaction.amount
							: wallet.balance - transaction.amount;
					return { ...wallet, balance: newBalance };
				}
				if (
					transaction.type === "transfer" &&
					wallet.id == transaction.recipientWalletId
				) {
					return { ...wallet, balance: wallet.balance + transaction.amount };
				}
				return wallet;
			});
		});

		setShowTransactionForm(false);
		toast.success(
			`${
				transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)
			} completed successfully!`
		);
	};

	const statistics = {
		totalTransactions: transactions.length,
		depositsCount: transactions.filter((t) => t.type === "deposit").length,
		withdrawalsCount: transactions.filter((t) => t.type === "withdrawal")
			.length,
		transfersCount: transactions.filter((t) => t.type === "transfer").length,
	};

	return (
		<div className="space-y-8">
			<Statistics {...statistics} />

			{currentView === "dashboard" ? (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<div
						className={`rounded-xl shadow-sm overflow-hidden h-[calc(100vh-16rem)] bg-white`}
					>
						<WalletList
							wallets={wallets}
							onCreateWallet={handleCreateWallet}
							onDeleteWallet={handleDeleteWallet}
							onUpdateWallet={handleUpdateWallet}
						/>
					</div>

					<div
						ref={transactionRef}
						className={`rounded-xl shadow-sm overflow-hidden h-[calc(100vh-16rem)] bg-white`}
					>
						<div className="h-full flex flex-col">
							<div
								className={`p-6 border-b border-gray-200`}
							>
								<div className="flex justify-between items-center">
									<h2
										className={`text-xl font-semibold text-white`}
									>
										Transactions
									</h2>
									<div className="flex gap-2">
										{!showTransactionForm ? (
											<button
												onClick={() => setShowTransactionForm(true)}
												className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
											>
												New Transaction
											</button>
										) : (
											<button
												onClick={() => setShowTransactionForm(false)}
												className={`px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50`}
											>
												Cancel
											</button>
										)}
									</div>
								</div>
							</div>

							<div className="flex-1 overflow-y-auto">
								{showTransactionForm ? (
									<div className="p-6">
										<div className="flex gap-2 mb-6">
											{["deposit", "withdrawal", "transfer"].map((type) => (
												<button
													key={type}
													onClick={() => setTransactionType(type)}
													className={`px-4 py-2 rounded-lg capitalize whitespace-nowrap ${
														transactionType === type
															? "bg-blue-600 text-white"
															: "bg-gray-100 text-gray-600 hover:bg-gray-200"
													}`}
												>
													{type}
												</button>
											))}
										</div>
										<TransactionForm
											type={transactionType}
											wallets={wallets}
											onComplete={handleTransaction}
										/>
									</div>
								) : (
									<div className="p-6">
										<TransactionList
											transactions={transactions}
											wallets={wallets}
										/>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			) : currentView === "history" ? (
				<div
					className={`rounded-xl shadow-sm overflow-hidden h-[calc(100vh-16rem)] bg-white`}
				>
					<TransactionHistory transactions={transactions} wallets={wallets} />
				</div>
			) : (
				<div
					className={`rounded-xl shadow-sm overflow-hidden h-[calc(100vh-16rem)] bg-white`}
				>
					<StatisticsView transactions={transactions} wallets={wallets} />
				</div>
			)}
		</div>
	);
}
