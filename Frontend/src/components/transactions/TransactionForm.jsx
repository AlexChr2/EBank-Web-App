import React, { useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Send } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmationDialog from "../common/ConfirmationDialog";

export default function TransactionForm({ type, wallets, onComplete }) {
	const [amount, setAmount] = useState("");
	const [description, setDescription] = useState("");
	const [sourceWalletId, setSourceWalletId] = useState(wallets[0]?.id || "");
	const [recipientWalletId, setRecipientWalletId] = useState("");
	const [loading, setLoading] = useState(false);
	const [showConfirmation, setShowConfirmation] = useState(false);

	const getConfirmationMessage = () => {
		const sourceCard = wallets.find((w) => w.id == sourceWalletId);
		const recipientCard = wallets.find((w) => w.id == recipientWalletId);
		const formattedAmount = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(parseFloat(amount));

		switch (type) {
			case "deposit":
				return `Are you sure you want to deposit ${formattedAmount} into ${sourceCard?.name}?`;
			case "withdrawal":
				return `Are you sure you want to withdraw ${formattedAmount} from ${sourceCard?.name}?`;
			case "transfer":
				return `Are you sure you want to transfer ${formattedAmount} from ${sourceCard?.name} to ${recipientCard?.name}?`;
			default:
				return "";
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const numAmount = parseFloat(amount);
			if (isNaN(numAmount) || numAmount <= 0) {
				throw new Error("Please enter a valid amount");
			}

			const sourceCard = wallets.find((w) => w.id == sourceWalletId);
			if (!sourceCard) {
				throw new Error("Please select a valid card");
			}

			if (type === "withdrawal" && sourceCard.balance < numAmount) {
				throw new Error("Insufficient funds");
			}

			if (type === "transfer") {
				if (!recipientWalletId) {
					throw new Error("Please select a recipient card");
				}
				if (recipientWalletId == sourceWalletId) {
					throw new Error("Cannot transfer to the same card");
				}
				if (sourceCard.balance < numAmount) {
					throw new Error("Insufficient funds");
				}
			}

			setShowConfirmation(true);
		} catch (error) {
			toast.error(
				error instanceof Error ? error.message : "Transaction failed"
			);
		}
	};

	const handleConfirmTransaction = async () => {
		setLoading(true);
		try {
			const transaction = {
				id: String(Date.now()),
				walletId: sourceWalletId,
				type,
				amount: parseFloat(amount),
				description: description.trim() || "",
				createdAt: new Date(),
				recipientWalletId: type === "transfer" ? recipientWalletId : undefined,
			};

			onComplete(transaction);
			setAmount("");
			setDescription("");
			setRecipientWalletId("");
			setShowConfirmation(false);
		} catch(error) {
			toast.error("Transaction failed");
			console.error(`Transaction failed: ${error}`);
		} finally {
			setLoading(false);
		}
	};

	const icons = {
		deposit: ArrowDownToLine,
		withdrawal: ArrowUpFromLine,
		transfer: Send,
	};

	const Icon = icons[type];

	return (
		<>
			<form onSubmit={handleSubmit} className="space-y-6">
				{/* Source Wallet */}
				<div>
					<label
						htmlFor="sourceWallet"
						className={`block text-sm font-medium mb-1 text-gray-700`}
					>
						Source Card
					</label>
					<select
						id="sourceWallet"
						value={sourceWalletId}
						onChange={(e) => setSourceWalletId(e.target.value)}
						className={`w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500`}
						required
					>
						{wallets.map((wallet) => (
							<option key={wallet.id} value={wallet.id}>
								{wallet.name} ({wallet.balance} {wallet.currency})
							</option>
						))}
					</select>
				</div>

				{/* Recipient Wallet (if transfer) */}
				{type === "transfer" && (
					<div>
						<label
							htmlFor="recipientWallet"
							className={`block text-sm font-medium mb-1 text-gray-700`}
						>
							Recipient Card
						</label>
						<select
							id="recipientWallet"
							value={recipientWalletId}
							onChange={(e) => setRecipientWalletId(e.target.value)}
							className={`w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 border-blue-500`}
							required
						>
							<option value="">Select recipient card</option>
							{wallets
								.filter((w) => w.id !== sourceWalletId)
								.map((wallet) => (
									<option key={wallet.id} value={wallet.id}>
										{wallet.name} ({wallet.balance} {wallet.currency})
									</option>
								))}
						</select>
					</div>
				)}

				{/* Amount */}
				<div>
					<label
						htmlFor="amount"
						className={`block text-sm font-medium mb-1 text-gray-700`}
					>
						Amount
					</label>
					<div className="relative">
						<span
							className={`absolute left-3 top-1/2 -translate-y-1/2 text-gray-500`}
						>
							$
						</span>
						<input
							id="amount"
							type="number"
							value={amount}
							onChange={(e) => setAmount(e.target.value)}
							className={`w-full pl-8 pr-3 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500`}
							placeholder="0.00"
							step="0.01"
							min="0"
							required
						/>
					</div>
				</div>

				{/* Description */}
				<div>
					<label
						htmlFor="description"
						className={`block text-sm font-medium mb-1 text-gray-700`}
					>
						Description (Optional)
					</label>
					<input
						id="description"
						type="text"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className={`w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500`}
						placeholder={`Enter ${type} description`}
					/>
				</div>

				{/* Submit */}
				<button
					type="submit"
					disabled={loading}
					className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed`}
				>
					{loading ? (
						"Processing..."
					) : (
						<>
							<Icon className="w-5 h-5" />
							<span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
						</>
					)}
				</button>
			</form>

			<ConfirmationDialog
				isOpen={showConfirmation}
				title={`Confirm ${type.charAt(0).toUpperCase() + type.slice(1)}`}
				message={getConfirmationMessage()}
				confirmLabel={type.charAt(0).toUpperCase() + type.slice(1)}
				onConfirm={handleConfirmTransaction}
				onCancel={() => setShowConfirmation(false)}
			/>
		</>
	);
}
