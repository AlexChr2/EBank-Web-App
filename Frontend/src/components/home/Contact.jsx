import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Contact() {
	return (
		<section className="py-24 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold text-gray-900 mb-4">
						Get in Touch
					</h2>
					<p className="text-lg text-gray-600">
						Our team is here to help you 24/7
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					<div className="text-center">
						<div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
							<Mail className="w-8 h-8 text-blue-600" />
						</div>
						<h3 className="text-xl font-semibold mb-2">Email</h3>
						<p className="text-gray-600">support@digibank.com</p>
					</div>

					<div className="text-center">
						<div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
							<Phone className="w-8 h-8 text-blue-600" />
						</div>
						<h3 className="text-xl font-semibold mb-2">Phone</h3>
						<p className="text-gray-600">+1 (555) 123-4567</p>
					</div>

					<div className="text-center">
						<div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
							<MapPin className="w-8 h-8 text-blue-600" />
						</div>
						<h3 className="text-xl font-semibold mb-2">Address</h3>
						<p className="text-gray-600">
							123 Innovation Drive
							<br />
							Tech City, TC 12345
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
