import React, { useState } from "react";
import { UserPlus, UserX, Search } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmationDialog from "../common/ConfirmationDialog";
import { useUsers } from "../../contexts/UserContext";

export default function UserDeletionManagement({ onClose }) {
	const { users, deleteUser, loading } = useUsers();
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedUser, setSelectedUser] = useState(null);
	const [showConfirmation, setShowConfirmation] = useState(false);

	if (loading) {
		return <div>Loading users...</div>;
	}

	const filteredUsers = users.filter(
		(user) =>
			user.email.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const handleDeleteUser = () => {
		if (selectedUser) {
			const userToDelete = users.find((u) => u.id === selectedUser);
			if (userToDelete?.role === "admin") {
				toast.error("Cannot delete admin users");
				return;
			}

			deleteUser(selectedUser);
			setShowConfirmation(false);
			onClose();
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-xl max-w-2xl w-full p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-2xl font-semibold text-gray-900">Delete User</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
					>
						×
					</button>
				</div>

				<div>
					<div className="relative mb-4">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
						<input
							type="text"
							placeholder="Search users..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
							className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
						/>
					</div>

					<div className="max-h-96 overflow-y-auto">
						{filteredUsers.map((user) => (
							<div
								key={user.id}
								className={`flex items-center justify-between p-4 rounded-lg mb-2 ${
									selectedUser === user.id
										? "bg-red-50 border border-red-200"
										: "bg-gray-50 hover:bg-gray-100"
								}`}
							>
								<div>
									<h3 className="font-medium text-gray-900">{user.name}</h3>
									<p className="text-sm text-gray-600">{user.email}</p>
									<span
										className={`text-xs px-2 py-1 rounded-full ${
											user.role === "admin"
												? "bg-purple-100 text-purple-700"
												: "bg-blue-100 text-blue-700"
										}`}
									>
										{user.role}
									</span>
								</div>
								<button
									onClick={() => {
										if (user.role === "admin") {
											toast.error("Cannot delete admin users");
											return;
										}
										setSelectedUser(user.id);
										setShowConfirmation(true);
									}}
									className={`p-2 rounded-lg ${
										user.role === "admin"
											? "text-gray-400 cursor-not-allowed"
											: "text-red-600 hover:bg-red-100"
									}`}
									disabled={user.role === "admin"}
								>
									<UserX className="w-5 h-5" />
								</button>
							</div>
						))}

						{filteredUsers.length === 0 && (
							<div className="text-center py-8 text-gray-500">
								No users found
							</div>
						)}
					</div>

					<div className="flex justify-end gap-3 mt-6">
						<button
							onClick={onClose}
							className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
						>
							Cancel
						</button>
					</div>
				</div>
			</div>

			<ConfirmationDialog
				isOpen={showConfirmation}
				title="Delete User"
				message="Are you sure you want to delete this user? This action cannot be undone."
				confirmLabel="Delete"
				onConfirm={handleDeleteUser}
				onCancel={() => {
					setShowConfirmation(false);
					setSelectedUser(null);
				}}
			/>
		</div>
	);
}
