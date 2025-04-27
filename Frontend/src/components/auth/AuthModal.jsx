import React, { useState } from "react";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { registerUser, loginUser } from "../../ApiService";
import { useUsers } from "../../contexts/UserContext";

export default function AuthModal({ isOpen, onClose, onSuccess, showSignUpOnly }) {
	const { addUser } = useUsers();
	const [isLogin, setIsLogin] = useState(() => {
		return showSignUpOnly != null ? !showSignUpOnly : true;
	});
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

	if (!isOpen) return null;

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);

		try {
			let userid = null;
			if (isLogin) {
				const returnval = await loginUser(email, password);
				userid = returnval.id;
				toast.success("Welcome back!");
				if (onSuccess != null)
					onSuccess(email, userid); // Pass email to determine admin status
			} else if (!isLogin) {
				const returnval = await registerUser(email, password);
				userid = returnval.id;
				addUser({'id': returnval.id, 'email': email, 'role': email.endsWith('@admin.com') ? 'admin' : 'user'});
				toast.success("Account created successfully!");
				if (onSuccess != null)
					onSuccess(email, userid);
			} else {
				throw new Error("Please enter valid credentials");
			}
		} catch (error) {
			let errorMessage = "An error occurred";

			if (error instanceof Error) {
				try {
					const parsed = JSON.parse(error.message);
					if (parsed && parsed.error) {
						errorMessage = parsed.error;
					} else {
						errorMessage = error.message;
					}
				} catch (e) {
					// Not JSON, use raw error message
					errorMessage = error.message;
				}
			} else if (typeof error === "string") {
				errorMessage = error;
			}

			toast.error(errorMessage); // Show clean message
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-xl max-w-md w-full p-6 relative">
				<button
					onClick={onClose}
					className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
				>
					<X className="w-5 h-5" />
				</button>

				<h2 className="text-2xl font-bold mb-6">
					{isLogin ? "Welcome Back" : "Create Account"}
				</h2>

				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Email
						</label>
						<input
							id="email"
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							required
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700 mb-1"
						>
							Password
						</label>
						<input
							id="password"
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
							required
						/>
					</div>

					<button
						type="submit"
						disabled={loading}
						className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{loading ? "Processing..." : isLogin ? "Sign In" : (showSignUpOnly ? "Create User" :"Sign Up")}
					</button>
				</form>

				{!showSignUpOnly &&
					<p className="mt-4 text-center text-sm text-gray-600">
						{isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
						<button
							onClick={() => {
								setIsLogin(!isLogin);
								setEmail('');
								setPassword('');
							}}
							className="text-blue-600 font-semibold hover:text-blue-700"
						>
							{isLogin ? "Sign Up" : "Sign In"}
						</button>
					</p>
				}
			</div>
		</div>
	);
}
