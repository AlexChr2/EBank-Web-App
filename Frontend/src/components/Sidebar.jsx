import React from 'react';
import {
	LayoutDashboard, 
	Wallet, 
	History, 
	BarChart2, 
	Target,
	Settings,
	LogOut
} from 'lucide-react';

function Sidebar({ activePage, onPageChange }) {
	const menuItems = [
		{ id: 'overview', icon: <LayoutDashboard size={20} />, label: 'Overview' },
		{ id: 'wallet', icon: <Wallet size={20} />, label: 'Wallet' },
		{ id: 'history', icon: <History size={20} />, label: 'History' },
		{ id: 'statistics', icon: <BarChart2 size={20} />, label: 'Statistics' },
		{ id: 'goals', icon: <Target size={20} />, label: 'Goals' },
	];

	return (
		<div className="sidebar">
			<div>
				<h1>Easybank</h1>
			</div>

			<div className="sidebar-menu">
				{menuItems.map((item) => (
					<div
						key={item.id}
						className={`sidebar-item ${activePage === item.id ? 'active' : ''}`}
						onClick={() => onPageChange(item.id)}
					>
						{item.icon}
						<span>{item.label}</span>
					</div>
				))}
			</div>

			<div className="sidebar-bottom">
				<div className="sidebar-item">
					<Settings size={20} />
					<span>Settings</span>
				</div>
				<div className="sidebar-item">
					<LogOut size={20} />
					<span>Log Out</span>
				</div>
			</div>
		</div>
	);
}

export default Sidebar;