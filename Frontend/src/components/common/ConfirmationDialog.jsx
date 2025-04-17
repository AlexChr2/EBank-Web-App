import React from "react";
import { X } from "lucide-react";

export default function ConfirmationDialog({
	isOpen,
	title,
	message,
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	onConfirm,
	onCancel,
}) {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-xl max-w-md w-full p-6 relative">
				<button
					onClick={onCancel}
					className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
				>
					<X className="w-5 h-5" />
				</button>

				<h2 className="text-xl font-semibold mb-4">{title}</h2>
				<p className="text-gray-600 mb-6">{message}</p>

				<div className="flex justify-end gap-3">
					<button
						onClick={onCancel}
						className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
					>
						{cancelLabel}
					</button>
					<button
						onClick={onConfirm}
						className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
}
