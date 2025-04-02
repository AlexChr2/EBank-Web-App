import React from 'react';

function Card({ balance, cardNumber, validThru, type, onClick }) {
	return (
		<div className="card" onClick={onClick}>
			<div className="card-balance">
				€{balance.toFixed(2)}
			</div>
			<div className="card-number">
				{cardNumber.match(/.{1,4}/g)?.join(' ')}
			</div>
			<div className="card-footer">
				<div className="card-valid-thru">
					VALID THRU<br />
					{validThru}
				</div>
				<div className="card-type">
					{type === 'visa' ? 'VISA' : 'Mastercard'}
				</div>
			</div>
		</div>
	);
}

export default Card;