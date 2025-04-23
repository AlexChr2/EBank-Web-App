const backendURL = "http://localhost:5000";

export const registerUser = async(email, password) => {
	const user = { email: email, password: password };
	return await sendToBackend("/api/create-user", "POST", user);
};

export const loginUser = async(email, password) => {
	const user = { email: email, password: password };
	return await sendToBackend("/api/login", "POST", user);
};

export const logout = async() => {
	return await sendToBackend("/api/logout", "POST");
}

export const createECard = async(name) => {
	const ecard = { name: name };
	return await sendToBackend("/api/create-card", "POST", ecard);
}

export const renameCard = async(card_id, new_name) => {
	const ecard = { card_id: card_id, new_card_name: new_name };
	return await sendToBackend("/api/rename-card", "PUT", ecard);
}

export const deleteCard = async(card_id) => {
	const ecard = { card_id: card_id };
	return await sendToBackend("/api/delete-card", "DELETE", ecard);
}

export const getCards = async() => {
	return await sendToBackend("/api/my-cards", "GET");
}

export const getTransactions = async() => {
	return await sendToBackend("/api/get-transactions", "GET");
}

export const getUsers = async() => {
	return await sendToBackend("/api/get-users", "GET");
}

export const deleteUser = async(user_id) => {
	const user = { user_id : user_id };
	return await sendToBackend("/api/delete-user", "DELETE", user);
}

export const makeTransaction = async(type, srcCardId, resCardId, amt, desc) => {
	const transaction = {
		type: type,
		source_card_id: srcCardId,
		recipient_card_id: resCardId,
		amount: amt,
		description: desc
	};
	return await sendToBackend("/api/make-transaction", "POST", transaction);
}

const sendToBackend = async(routePoint, method, body = null, additionalHeaders = {}) => {
	try {
		const options = {
			method,
			credentials: "include", // send cookies to the back-end
			headers : {
				"Content-Type": "application/json",
				...additionalHeaders, // allow custom headers
			}
		}

		// include body method only for methods that allow it
		if (body && method !== "GET")
			options.body = JSON.stringify(body);

		const response = await fetch(`${backendURL}${routePoint}`, options);

		if (!response.ok) {
			const errorText = await response.text().catch(() => "Unknown error!");
			console.error(`HTTP Error ${response.status}: ${errorText}`)
			throw new Error(errorText);
		}

		// avoid parsing empty responses
		const contentType = response.headers.get("Content-Type");
		if (contentType && contentType.includes("application/json")) {
			return await response.json();
		}

		return await response.text(); // fallback for non-json responses
	} catch(error) {
		console.log(`API call failed: ${error}`);
		throw error;
	}
};

export default loginUser;