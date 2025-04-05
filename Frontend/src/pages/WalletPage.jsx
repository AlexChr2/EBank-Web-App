import React, { useState } from 'react';
import { 
	ArrowDownToLine,
	ArrowLeftRight,
	KeyRound,
	RefreshCw,
	Lock,
	Settings as SettingsIcon
} from 'lucide-react';
import './WalletPage.css'
import Card from '../components/Card';

function WalletPage() {
	const [selectedCard, setSelectedCard] = useState(null);

	const cards = [
		{
			id: '1',
			balance: 1580.50,
			cardNumber: '4255010200744345',
			validThru: '04/22',
			type: 'visa'
		},
		{
			id: '2',
			balance: 2350.10,
			cardNumber: '4345000031004588',
			validThru: '07/24',
			type: 'mastercard'
		},
		{
			id: '3',
			balance: 360.20,
			cardNumber: '3850569830308900',
			validThru: '07/21',
			type: 'visa'
		}
	];

	const actions = [
		{ icon: <ArrowDownToLine size={24} />, label: 'Top up' },
		{ icon: <ArrowLeftRight size={24} />, label: 'Transfer' },
		{ icon: <KeyRound size={24} />, label: 'Change PIN-code' },
		{ icon: <RefreshCw size={24} />, label: 'Reissue card' },
		{ icon: <Lock size={24} />, label: 'Block card' },
		{ icon: <SettingsIcon size={24} />, label: 'Settings' }
	];

	return (
		<div className="wallet-page">
			<div className="wallet-header">
				<h2>Wallet</h2>
				<button className="add-new-button">
					Add new
				</button>
			</div>

			<div className="wallet-content">
				<div className="cards-container">
					{cards.map(card => (
						<Card
							key={card.id}
							{...card}
							onClick={() => setSelectedCard(card.id)}
						/>
					))}
				</div>

				<div className="actions-panel">
					<h3>Actions</h3>
					<div className="actions-grid">
						{actions.map((action, index) => (
							<button key={index} className="action-button">
								{action.icon}
								<span>{action.label}</span>
							</button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

function MainWalletPage() {
	return (
		<div className="app-container">
			<Sidebar activePage={activePage} onPageChange={setActivePage} />
			<main className="main-content">
				<WalletPage />
			</main>
		</div>
	);
}

export default MainWalletPage;