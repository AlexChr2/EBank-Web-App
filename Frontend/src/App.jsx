import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import Hero from './components/home/Hero';
import Testimonials from './components/home/Testimonials';
import Contact from './components/home/Contact';
import Sidebar from './components/layout/Sidebar';
import AuthModal from './components/auth/AuthModal';
import DashboardContent from './components/dashboard/DashboardContent';
import AdminDashboard from './components/admin/AdminDashboard';
import { UserProvider } from './contexts/UserContext';
import { logout } from './ApiService';

function App() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [currentRoute, setCurrentRoute] = useState('dashboard');
	const [isAdmin, setIsAdmin] = useState(false);
	const [showAuthModal, setShowAuthModal] = useState(false);

	useEffect(() => {
		const handleTransactionEvent = (event) => {
			const { type } = event.detail;
			window.dispatchEvent(new CustomEvent('showTransactionForm', { detail: { type } }));
		};

		window.addEventListener('initiateTransaction', handleTransactionEvent);

		return () => {
			window.removeEventListener('initiateTransaction', handleTransactionEvent);
		};
	}, []);

	const handleLogout = async () => {
		// logout from the backend
		logout();
		setIsLoggedIn(false);
		setCurrentRoute('dashboard');
	};

	const handleNavigate = (route) => {
		if (route === 'logout') {
			handleLogout();
		} else {
			setCurrentRoute(route);
		}
	};

	const handleAuthSuccess = (email) => {
		setIsLoggedIn(true);
		setShowAuthModal(false);
		setIsAdmin(email.endsWith('@admin.com'));
		setCurrentRoute('dashboard');
	};

	return (
		<UserProvider>
			<div className="min-h-screen bg-white">
				{!isLoggedIn ? (
					<>
						<Hero onAuthClick={() => setShowAuthModal(true)} />
						<Testimonials />
						<Contact />
						<AuthModal
							isOpen={showAuthModal}
							onClose={() => setShowAuthModal(false)}
							onSuccess={handleAuthSuccess}
						/>
					</>
				) : (
					<div className="flex h-screen overflow-hidden">
						<Sidebar
							isAdmin={isAdmin}
							currentRoute={currentRoute}
							onNavigate={handleNavigate}
						/>
						<main className="flex-1 relative">
							<div className="absolute inset-0 overflow-y-auto">
								<div className="p-8">
									{currentRoute === 'admin' && isAdmin ? (
										<AdminDashboard />
									) : (
										<DashboardContent />
									)}
								</div>
							</div>
						</main>
					</div>
				)}
				<Toaster position="top-center" />
			</div>
		</UserProvider>
	);
}

export default App;