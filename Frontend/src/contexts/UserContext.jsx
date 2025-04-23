import React, { createContext, useContext, useEffect, useState } from "react";
import { getUsers, deleteUser as backendDeleteUser } from "../ApiService";
import toast from "react-hot-toast";

// Create context without types
const UserContext = createContext(undefined);

export function UserProvider({ children }) {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);

	// load the users from the backend
	useEffect(() => {
		getUsers()
			.then((user_input) => {
				const updatedUsers = user_input.map((user) => ({
					...user,
					role: user.email.endsWith("@admin.com") ? "admin" : "user",
				}));
				setUsers(updatedUsers);
			})
			.catch((error) => toast.error(error))
			.finally(() => setLoading(false));
	}, []);

	const addUser = (user) => {
		setUsers((prevUsers) => [...prevUsers, user]);
	};

	const deleteUser = (id) => {
		backendDeleteUser(id)
			.then(() => toast.success("User deleted successfully!"))
			.catch((error) => {
				toast.error(error);
				return;
			});
		setUsers((prevUsers) => prevUsers.filter((user) => user.id != id));
	};

	return (
		<UserContext.Provider value={{ users, addUser, deleteUser, loading }}>
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
