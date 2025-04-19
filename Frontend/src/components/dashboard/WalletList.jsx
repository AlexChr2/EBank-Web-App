import React, { useState } from "react";
import { Plus, Trash2, CreditCard, Pencil } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmationDialog from "../common/ConfirmationDialog";

export default function WalletList({
	wallets,
	onCreateWallet,
	onDeleteWallet,
	onUpdateWallet,
}) {
	const [showNameInput, setShowNameInput] = useState(false);
	const [newCardName, setNewCardName] = useState("");
	const [editingWallet, setEditingWallet] = useState(null);
	const [editName, setEditName] = useState("");
	const [deleteConfirmation, setDeleteConfirmation] = useState({
		isOpen: false,
		walletId: null,
	});

	const handleCreateCard = (e) => {
		e.preventDefault();
		if (!newCardName.trim()) {
			toast.error("Please enter a card name");
			return;
		}
		onCreateWallet(newCardName.trim());
		setNewCardName("");
		setShowNameInput(false);
	};

	const handleEditSubmit = (id) => {
		if (!editName.trim()) {
			toast.error("Please enter a card name");
			return;
		}
		onUpdateWallet(id, editName.trim());
		setEditingWallet(null);
		setEditName("");
	};

	const handleDeleteClick = (id) => {
		setDeleteConfirmation({ isOpen: true, walletId: id });
	};

	const handleConfirmDelete = () => {
		if (deleteConfirmation.walletId) {
			onDeleteWallet(deleteConfirmation.walletId);
		}
		setDeleteConfirmation({ isOpen: false, walletId: null });
	};

	return (
		<div className="h-full flex flex-col">
			<div className="sticky top-0 bg-white p-6 border-b z-10">
				<div className="flex justify-between items-center">
					<h2 className="text-xl font-semibold text-gray-900">My Cards</h2>
					{!showNameInput && (
						<button
							onClick={() => setShowNameInput(true)}
							className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
						>
							<Plus className="w-4 h-4" />
							New Card
						</button>
					)}
				</div>
				{showNameInput && (
					<form onSubmit={handleCreateCard} className="mt-4">
						<div className="flex gap-2">
							<input
								type="text"
								value={newCardName}
								onChange={(e) => setNewCardName(e.target.value)}
								placeholder="Enter card name"
								className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								autoFocus
							/>
							<button
								type="submit"
								className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
							>
								Create
							</button>
							<button
								type="button"
								onClick={() => {
									setShowNameInput(false);
									setNewCardName("");
								}}
								className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
							>
								Cancel
							</button>
						</div>
					</form>
				)}
			</div>

			<div className="flex-1 overflow-y-auto p-6">
				<div className="space-y-4">
					{wallets.map((wallet) => (
						<div
							key={wallet.id}
							className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
						>
							<div className="flex items-center gap-4">
								<div className="p-2 bg-blue-100 rounded-lg">
									<CreditCard className="w-6 h-6 text-blue-600" />
								</div>
								<div>
									{editingWallet === wallet.id ? (
										<div className="flex gap-2 items-center">
											<input
												type="text"
												value={editName}
												onChange={(e) => setEditName(e.target.value)}
												className="px-2 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
												placeholder="Enter new name"
												autoFocus
											/>
											<button
												onClick={() => handleEditSubmit(wallet.id)}
												className="text-green-600 hover:text-green-700"
											>
												✓
											</button>
											<button
												onClick={() => {
													setEditingWallet(null);
													setEditName("");
												}}
												className="text-red-600 hover:text-red-700"
											>
												✕
											</button>
										</div>
									) : (
										<h3 className="font-medium text-gray-900">{wallet.name}</h3>
									)}
									<p className="text-sm text-gray-600">
										{new Intl.NumberFormat("en-US", {
											style: "currency",
											currency: wallet.currency,
										}).format(wallet.balance)}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								{editingWallet !== wallet.id && (
									<button
										onClick={() => {
											setEditingWallet(wallet.id);
											setEditName(wallet.name);
										}}
										className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
									>
										<Pencil className="w-5 h-5" />
									</button>
								)}
								<button
									onClick={() => handleDeleteClick(wallet.id)}
									className="p-2 text-gray-400 hover:text-red-600 transition-colors"
								>
									<Trash2 className="w-5 h-5" />
								</button>
							</div>
						</div>
					))}

					{wallets.length === 0 && (
						<div className="text-center py-8 text-gray-500">
							No cards yet. Create one to get started!
						</div>
					)}
				</div>
			</div>

			<ConfirmationDialog
				isOpen={deleteConfirmation.isOpen}
				title="Delete Card"
				message="Are you sure you want to delete this card? This action cannot be undone."
				confirmLabel="Delete"
				onConfirm={handleConfirmDelete}
				onCancel={() =>
					setDeleteConfirmation({ isOpen: false, walletId: null })
				}
			/>
		</div>
	);
}
