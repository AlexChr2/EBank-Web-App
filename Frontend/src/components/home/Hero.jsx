import React from "react";
import { Wallet, Shield, Zap } from "lucide-react";

export default function Hero({ onAuthClick }) {
	const scrollToTestimonials = () => {
		const testimonialsSection = document.getElementById("testimonials");
		if (testimonialsSection) {
			testimonialsSection.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
				<div className="text-center">
					<h1 className="text-4xl md:text-6xl font-bold mb-6">
						Banking Made Simple
					</h1>
					<p className="text-xl md:text-2xl mb-12 text-blue-100">
						Experience the future of digital banking with DigiBank
					</p>
					<div className="flex flex-wrap justify-center gap-8">
						<button
							onClick={onAuthClick}
							className="group bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
						>
							Get Started
						</button>
						<button
							onClick={scrollToTestimonials}
							className="group border-2 border-white px-8 py-3 rounded-lg font-semibold hover:bg-white/10 transition-all duration-200 ease-in-out transform hover:scale-105 active:scale-95"
						>
							Learn More
						</button>
					</div>
				</div>

				<div className="mt-24 grid md:grid-cols-3 gap-8">
					<div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg transform transition-all duration-200 hover:scale-105">
						<Wallet className="w-12 h-12 mb-4 transform transition-all duration-200 group-hover:scale-110 group-hover:rotate-6" />
						<h3 className="text-xl font-semibold mb-2">Digital Wallets</h3>
						<p className="text-blue-100">
							Manage multiple currencies in secure digital wallets with
							real-time balance updates
						</p>
					</div>

					<div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg transform transition-all duration-200 hover:scale-105">
						<Shield className="w-12 h-12 mb-4 transform transition-all duration-200 group-hover:scale-110 group-hover:rotate-6" />
						<h3 className="text-xl font-semibold mb-2">Secure Transactions</h3>
						<p className="text-blue-100">
							State-of-the-art security measures to protect your financial data
						</p>
					</div>

					<div className="bg-white/10 p-6 rounded-xl backdrop-blur-lg transform transition-all duration-200 hover:scale-105">
						<Zap className="w-12 h-12 mb-4 transform transition-all duration-200 group-hover:scale-110 group-hover:rotate-6" />
						<h3 className="text-xl font-semibold mb-2">Instant Transfers</h3>
						<p className="text-blue-100">
							Send and receive money instantly, anywhere in the world
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
