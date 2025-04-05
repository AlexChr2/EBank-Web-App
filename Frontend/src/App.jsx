import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import WalletPage from './pages/WalletPage';
import MainPage from './pages/MainPage'

function App() {
	const [activePage, setActivePage] = useState('wallet');

	return (
		<MainPage />
	);
}

export default App;