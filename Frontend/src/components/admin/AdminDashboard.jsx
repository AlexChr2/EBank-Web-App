import React, { useState } from "react";
import { Users, UserPlus, UserX, BarChart2 } from "lucide-react";
import toast from "react-hot-toast";

// Placeholder admin data
const initialUsers = [
	{
		id: "1",
		name: "John Doe",
		email: "john@example.com",
		role: "user",
	},
	{
		id: "2",
		name: "Jane Smith",
		email: "jane@example.com",
		role: "user",
	},
];

export default function AdminDashboard() {
	const [users, setUsers] = useState(initialUsers);
	const [showCreateUser, setShowCreateUser] = useState(false);
	const [newUser, setNewUser] = useState({ name: "", email: "", role: "user" });

	const handleCreateUser = (e) => {
		e.preventDefault();
		const user = {
			id: String(Date.now()),
			...newUser,
		};
		setUsers([...users, user]);
		setNewUser({ name: "", email: "", role: "user" });
		setShowCreateUser(false);
		toast.success("User created successfully!");
	};

	const handleDeleteUser = (id) => {
		setUsers(users.filter((user) => user.id !== id));
		toast.success("User deleted successfully!");
	};

	const stats = [
		{
			label: "Total Users",
			value: users.length,
			icon: Users,
			color: "bg-blue-100 text-blue-600",
		},
		{
			label: "Regular Users",
			value: users.filter((u) => u.role === "user").length,
			icon: UserPlus,
			color: "bg-green-100 text-green-600",
		},
		{
			label: "Admins",
			value: users.filter((u) => u.role === "admin").length,
			icon: UserX,
			color: "bg-purple-100 text-purple-600",
		},
	];

	return (
		<div className="space-y-8">
			{/* Admin Statistics */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{stats.map((stat, index) => (
					<div key={index} className="bg-white p-6 rounded-xl shadow-sm">
						<div className="flex items-center gap-4">
							<div className={`p-3 rounded-lg ${stat.color}`}>
								<stat.icon className="w-6 h-6" />
							</div>
							<div>
								<p className="text-sm text-gray-600">{stat.label}</p>
								<p className="text-2xl font-semibold text-gray-900">
									{stat.value}
								</p>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* User Management */}
			<div className="bg-white rounded-xl shadow-sm p-6">
				<div className="flex justify-between items-center mb-6">
					<h2 className="text-xl font-semibold text-gray-900">
						User Management
					</h2>
					<button
						onClick={() => setShowCreateUser(!showCreateUser)}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						{showCreateUser ? "Cancel" : "Create User"}
					</button>
				</div>

				{showCreateUser && (
					<form
						onSubmit={handleCreateUser}
						className="mb-8 bg-gray-50 p-6 rounded-lg"
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Name
								</label>
								<input
									type="text"
									value={newUser.name}
									onChange={(e) =>
										setNewUser({ ...newUser, name: e.target.value })
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Email
								</label>
								<input
									type="email"
									value={newUser.email}
									onChange={(e) =>
										setNewUser({ ...newUser, email: e.target.value })
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
									required
								/>
							</div>
							<div>
								<label className="block text-sm font-medium text-gray-700 mb-1">
									Role
								</label>
								<select
									value={newUser.role}
									onChange={(e) =>
										setNewUser({ ...newUser, role: e.target.value })
									}
									className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
								>
									<option value="user">User</option>
									<option value="admin">Admin</option>
								</select>
							</div>
							<div className="flex items-end">
								<button
									type="submit"
									className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
								>
									Create User
								</button>
							</div>
						</div>
					</form>
				)}

				<div className="overflow-x-auto">
					<table className="w-full">
						<thead>
							<tr className="border-b border-gray-200">
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Name
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Email
								</th>
								<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
									Role
								</th>
								<th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
									Actions
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-200">
							{users.map((user) => (
								<tr key={user.id} className="hover:bg-gray-50">
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
										{user.name}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
										{user.email}
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-sm">
										<span
											className={`px-2 py-1 rounded-full text-xs font-medium ${
												user.role === "admin"
													? "bg-purple-100 text-purple-700"
													: "bg-green-100 text-green-700"
											}`}
										>
											{user.role}
										</span>
									</td>
									<td className="px-6 py-4 whitespace-nowrap text-right text-sm">
										<button
											onClick={() => handleDeleteUser(user.id)}
											className="text-red-600 hover:text-red-900 transition-colors"
										>
											Delete
										</button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
}
