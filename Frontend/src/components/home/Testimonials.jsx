import React from "react";
import { Star } from "lucide-react";

const testimonials = [
	{
		name: "Sarah Johnson",
		role: "Small Business Owner",
		image:
			"https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150",
		content:
			"DigiBank has transformed how I manage my business finances. The real-time tracking and instant transfers are game-changers.",
	},
	{
		name: "Michael Chen",
		role: "Freelance Developer",
		image:
			"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150",
		content:
			"The ease-of-use of this app have made international client payments a breeze!",
	},
	{
		name: "Emily Rodriguez",
		role: "Digital Nomad",
		image:
			"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150&h=150",
		content:
			"Being able to manage my money from anywhere in the world with such a user-friendly interface is incredible.",
	},
];

export default function Testimonials() {
	return (
		<section id="testimonials" className="py-24 bg-gray-50">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="text-center mb-16">
					<h2 className="text-3xl font-bold text-gray-900 mb-4">
						What Our Users Say
					</h2>
					<p className="text-lg text-gray-600">
						Join thousands of satisfied customers who trust DigiBank
					</p>
				</div>

				<div className="grid md:grid-cols-3 gap-8">
					{testimonials.map((testimonial, index) => (
						<div
							key={index}
							className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow transform hover:scale-105 transition-all duration-200"
						>
							<div className="flex items-center gap-4 mb-6">
								<img
									src={testimonial.image}
									alt={testimonial.name}
									className="w-16 h-16 rounded-full object-cover"
								/>
								<div>
									<h3 className="font-semibold text-gray-900">
										{testimonial.name}
									</h3>
									<p className="text-gray-600">{testimonial.role}</p>
								</div>
							</div>
							<div className="flex mb-4">
								{[...Array(5)].map((_, i) => (
									<Star
										key={i}
										className="w-5 h-5 text-yellow-400 fill-current"
									/>
								))}
							</div>
							<p className="text-gray-700">{testimonial.content}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
