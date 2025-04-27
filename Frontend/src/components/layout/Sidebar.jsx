import React, { useState } from "react";
import {
	Wallet,
	ArrowDownToLine,
	ArrowUpFromLine,
	Send,
	History,
	BarChart2,
	LogOut,
	UserPlus,
	UserX,
} from "lucide-react";
import UserDeletionManagement from "../admin/UserDeletionManagement";
import AuthModal from "../auth/AuthModal";
import { useUsers } from "../../contexts/UserContext";

export default function Sidebar({ isAdmin, onNavigate, currentRoute }) {
	const { addUser } = useUsers();
	const [showUserManagement, setShowUserManagement] = useState(false);
	const [userManagementAction, setUserManagementAction] = useState("create");

	const primaryMenuItems = [
		{
			icon: ArrowDownToLine,
			label: "Deposit",
			route: "deposit",
			action: "deposit",
		},
		{
			icon: ArrowUpFromLine,
			label: "Withdraw",
			route: "withdraw",
			action: "withdrawal",
		},
		{ icon: Send, label: "Transfer", route: "transfer", action: "transfer" },
		{ icon: History, label: "History", route: "history" },
		{ icon: BarChart2, label: "Statistics", route: "stats" },
	];

	const adminItems = [
		{ icon: UserPlus, label: "Create", route: "create-user", action: "create" },
		{ icon: UserX, label: "Delete", route: "delete-user", action: "delete" },
	];

	const bottomMenuItems = [{ icon: LogOut, label: "Logout", route: "logout" }];

	const handleMenuClick = (item) => {
		if (["deposit", "withdrawal", "transfer"].includes(item.action)) {
			window.dispatchEvent(
				new CustomEvent("initiateTransaction", {
					detail: { type: item.action },
				})
			);
		} else if (item.route === "history") {
			window.dispatchEvent(
				new CustomEvent("changeView", {
					detail: { view: "history" },
				})
			);
		} else if (item.route === "stats") {
			window.dispatchEvent(
				new CustomEvent("changeView", {
					detail: { view: "stats" },
				})
			);
		} else if (["deposit", "withdraw", "transfer"].includes(item.route)) {
			window.dispatchEvent(
				new CustomEvent("changeView", {
					detail: { view: "dashboard" },
				})
			);
		} else if (item.route === "create-user" || item.route === "delete-user") {
			setUserManagementAction(item.action);
			setShowUserManagement(true);
		}
		onNavigate(item.route);
	};

	const onAuthSuccess = (email, id) => {
		addUser({"id": id, "email": email, "role": email.endsWith('@admin.com') ? "admin" : "user"});
	};

	return (
		<>
			<div className="w-64 bg-white h-screen shadow-lg flex flex-col">
				<div className="p-4 border-b border-gray-200">
					<div className="flex items-center gap-2">
						<Wallet className="w-8 h-8 text-blue-600 animate-pulse" />
						<span className="text-xl font-bold text-gray-900">DigiBank</span>
					</div>
				</div>

				<nav className="flex-1 p-4">
					<ul className="space-y-2">
						{primaryMenuItems.map((item) => (
							<li key={item.route}>
								<button
									onClick={() => handleMenuClick(item)}
									className={`group w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out
										${
											currentRoute === item.route
												? "bg-blue-600 text-white"
												: "text-gray-600 hover:bg-gray-50"
										}`}
								>
									<div className="relative">
										<item.icon className="w-5 h-5 transition-all duration-200 ease-in-out transform group-hover:scale-110 group-active:scale-90" />
										<div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-20 group-active:opacity-40 rounded-full transition-opacity duration-200 ease-in-out" />
									</div>
									<span>{item.label}</span>
								</button>
							</li>
						))}

						{isAdmin && (
							<>
								<li className="pt-4 pb-2">
									<div className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
										Admin
									</div>
								</li>
								{adminItems.map((item) => (
									<li key={item.route}>
										<button
											onClick={() => handleMenuClick(item)}
											className={`group w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out
												${
													currentRoute === item.route
														? "bg-blue-600 text-white"
														: "text-gray-600 hover:bg-gray-50"
												}`}
										>
											<div className="relative">
												<item.icon className="w-5 h-5 transition-all duration-200 ease-in-out transform group-hover:scale-110 group-active:scale-90" />
												<div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-20 group-active:opacity-40 rounded-full transition-opacity duration-200 ease-in-out" />
											</div>
											<span>{item.label}</span>
										</button>
									</li>
								))}
							</>
						)}
					</ul>
				</nav>

				<div className="p-4 border-t border-gray-200">
					<ul className="space-y-2">
						{bottomMenuItems.map((item) => (
							<li key={item.route}>
								<button
									onClick={() => handleMenuClick(item)}
									className={`group w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ease-in-out
										${
											currentRoute === item.route
												? "bg-blue-600 text-white"
												: "text-gray-600 hover:bg-gray-50"
										}`}
								>
									<div className="relative">
										<item.icon className="w-5 h-5 transition-all duration-200 ease-in-out transform group-hover:scale-110 group-active:scale-90" />
										<div className="absolute inset-0 bg-current opacity-0 group-hover:opacity-20 group-active:opacity-40 rounded-full transition-opacity duration-200 ease-in-out" />
									</div>
									<span>{item.label}</span>
								</button>
							</li>
						))}
					</ul>
				</div>
			</div>

			{showUserManagement && userManagementAction === "create" && (
				<AuthModal
					isOpen={showUserManagement}
					onClose={() => setShowUserManagement(false)}
					onSuccess={onAuthSuccess}
					showSignUpOnly={true}
				/>
			)}

			{showUserManagement && userManagementAction !== "create" && (
				<UserDeletionManagement
					onClose={() => {setShowUserManagement(false)}}
				/>
			)}
		</>
	);
}
