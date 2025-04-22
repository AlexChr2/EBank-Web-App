import React, { createContext, useContext, useState } from "react";

// Initial dummy users
const initialUsers = [
	{ id: "1", name: "John Doe", email: "john@example.com", role: "user" },
	{ id: "2", name: "Jane Smith", email: "jane@example.com", role: "user" },
	{ id: "3", name: "Admin User", email: "admin@admin.com", role: "admin" },
	{ id: "4", name: "Sarah Wilson", email: "sarah@example.com", role: "user" },
	{ id: "5", name: "Mike Johnson", email: "mike@example.com", role: "user" },
];

// Create context without types
const UserContext = createContext(undefined);

export function UserProvider({ children }) {
	const [users, setUsers] = useState(initialUsers);

	const addUser = (user) => {
		setUsers((prevUsers) => [...prevUsers, user]);
	};

	const deleteUser = (id) => {
		setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
	};

	return (
		<UserContext.Provider value={{ users, addUser, deleteUser }}>
			{children}
		</UserContext.Provider>
	);
}

export function useUsers() {
	const context = useContext(UserContext);
	if (context === undefined) {
		throw new Error("useUsers must be used within a UserProvider");
	}
	return context;
}
