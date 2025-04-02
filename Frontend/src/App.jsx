import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import WalletPage from './components/WalletPage';

function App() {
	const [activePage, setActivePage] = useState('wallet');

	return (
		<div className="app-container">
			<Sidebar activePage={activePage} onPageChange={setActivePage} />
			<main className="main-content">
				<WalletPage />
			</main>
		</div>
	);
}

export default App;