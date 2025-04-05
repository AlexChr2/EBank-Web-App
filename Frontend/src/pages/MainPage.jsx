import React from 'react';
import './MainPage.css'
import { ArrowRight, Send, Zap, Shield } from 'lucide-react';

function App() {
	return (
		<div>
			<header className="header">
				<div className="logo">Zenpay</div>
				<nav className="nav-menu">
					<a href="#" className="nav-link">About</a>
					<a href="#" className="nav-link">Products</a>
					<a href="#" className="nav-link">Resources</a>
					<a href="#" className="nav-link">Support</a>
				</nav>
				<div className="auth-buttons">
					<button className="btn btn-outline">Sign in</button>
					<button className="btn btn-primary">Get Started</button>
				</div>
			</header>

			<section className="hero">
				<h1>Revolutionize Your Payments Experience</h1>
				<p>
					Unlock seamless, secure, and instant financial transactions. Manage, track, and control
					money effortlessly with the ability to send and integrate multiple financial services.
				</p>
				<div className="auth-buttons">
					<button className="btn btn-primary">Get Started</button>
					<button className="btn btn-outline">Learn More</button>
				</div>

				<div className="hero-features">
					<div className="feature-card">
						<div className="feature-icon">
							<Send size={24} color="#00D4FF" />
						</div>
						<h3>Secure Transfer</h3>
						<p>Send money quickly and securely with our advanced encryption system.</p>
					</div>
					<div className="feature-card">
						<div className="feature-icon">
							<Zap size={24} color="#00D4FF" />
						</div>
						<h3>Seamless Integration</h3>
						<p>Easy to implement financial services, from payment processing to account management.</p>
					</div>
					<div className="feature-card">
						<div className="feature-icon">
							<Shield size={24} color="#00D4FF" />
						</div>
						<h3>Multi-currency Support</h3>
						<p>Designed to handle worldwide currencies with real-time conversion rates.</p>
					</div>
				</div>
			</section>

			<section className="solutions">
				<div className="container">
					<h2>Empower Your Financial Journey<br />with Seamless Solutions</h2>
					<p>Explore our powerful features for seamless payments</p>

					<div className="solutions-grid">
						<div className="solution-card">
							<h3>Real-time Transaction</h3>
							<p>Track and monitor your financial transactions in real-time.</p>
							<img src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=500" alt="Real-time transactions" />
						</div>
						<div className="solution-card">
							<h3>Seamless Integration</h3>
							<p>Connect with multiple platforms and services.</p>
							<img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500" alt="Integration" />
						</div>
						<div className="solution-card">
							<h3>Multi-Currency Support</h3>
							<p>Handle transactions in multiple currencies effortlessly.</p>
							<img src="https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=500" alt="Multi-currency" />
						</div>
						<div className="solution-card">
							<h3>User-Friendly Interface</h3>
							<p>Simple and intuitive design for the best user experience.</p>
							<img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500" alt="User interface" />
						</div>
					</div>
				</div>
			</section>

			<section className="testimonials">
				<div className="container">
					<h2>Customer Stories</h2>
					<div className="testimonial-card">
						<div className="testimonial-header">
							<img 
								src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100"
								alt="Customer"
								className="testimonial-avatar"
							/>
							<div>
								<h4>John Smith</h4>
								<p>Finance Executive</p>
							</div>
						</div>
						<p>"The best payment solution I've ever used. Secure, efficient, and integrates perfectly with all my financial tools. Highly recommend!"</p>
					</div>

					<div className="stats">
						<div className="stat-item">
							<div className="stat-number">100%</div>
							<p>Secure transactions</p>
						</div>
						<div className="stat-item">
							<div className="stat-number">98%</div>
							<p>Customer satisfaction</p>
						</div>
					</div>
				</div>
			</section>

			<section className="how-it-works">
				<div className="container">
					<h2>How It Works</h2>
					<div className="steps">
						<div className="step-card">
							<img 
								src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=500"
								alt="Sign up"
								className="step-image"
							/>
							<h3>Sign Up</h3>
							<p>Create your account in minutes</p>
						</div>
						<div className="step-card">
							<img 
								src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=500"
								alt="Add bank account"
								className="step-image"
							/>
							<h3>Add Your Bank Account</h3>
							<p>Connect your existing accounts</p>
						</div>
						<div className="step-card">
							<img 
								src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=500"
								alt="Start transacting"
								className="step-image"
							/>
							<h3>Start Transacting</h3>
							<p>Send and receive money instantly</p>
						</div>
					</div>
				</div>
			</section>

			<section className="faq">
				<div className="container">
					<h2>Need Help?</h2>
					<div className="faq-item">
						<h3>Do I need to link all my bank accounts and cards to use Zenpay?</h3>
						<ArrowRight size={20} />
					</div>
					<div className="faq-item">
						<h3>How long does it take to set up my Zenpay account?</h3>
						<ArrowRight size={20} />
					</div>
					<div className="faq-item">
						<h3>Can Zenpay handle transactions in multiple currencies?</h3>
						<ArrowRight size={20} />
					</div>
				</div>
			</section>

			<section className="cta">
				<div className="container">
					<h2>Ready to simplify your<br />financial transactions?</h2>
					<button className="btn btn-primary">Get Started Now</button>
				</div>
			</section>

			<footer className="footer">
				<div className="footer-grid">
					<div>
						<div className="footer-logo">Zenpay</div>
						<p>Simplifying financial transactions for everyone.</p>
					</div>
					<div className="footer-links">
						<h4>Product</h4>
						<ul>
							<li><a href="#">Features</a></li>
							<li><a href="#">Security</a></li>
							<li><a href="#">Business</a></li>
							<li><a href="#">Enterprise</a></li>
						</ul>
					</div>
					<div className="footer-links">
						<h4>Company</h4>
						<ul>
							<li><a href="#">About</a></li>
							<li><a href="#">Careers</a></li>
							<li><a href="#">Press</a></li>
							<li><a href="#">Blog</a></li>
						</ul>
					</div>
					<div className="footer-links">
						<h4>Resources</h4>
						<ul>
							<li><a href="#">Documentation</a></li>
							<li><a href="#">Help Center</a></li>
							<li><a href="#">Status</a></li>
							<li><a href="#">Contact</a></li>
						</ul>
					</div>
				</div>
			</footer>
		</div>
	);
}

export default App;