# models.py
from flask_sqlalchemy import SQLAlchemy
from enum import Enum
from datetime import datetime

db = SQLAlchemy()

class TransactionType(Enum):
	DEPOSIT    = "deposit"
	WITHDRAWAL = "withdrawal"
	TRANSFER   = "transfer"

class User(db.Model):
	__tablename__ = 'users'
	id       = db.Column(db.Integer, primary_key=True)
	email    = db.Column(db.String(120), unique=True, nullable=False)
	password = db.Column(db.String(128), nullable=False)  # store hashes!

	ecards   = db.relationship('ECard', backref='owner', lazy=True)
	txns     = db.relationship('Transaction', backref='user', lazy=True)


class ECard(db.Model):
	__tablename__ = 'ecards'
	id          = db.Column(db.Integer, primary_key=True)
	user_id     = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
	name        = db.Column(db.String(50), nullable=False)
	cash_amount = db.Column(db.Float, default=0.0, nullable=False)

	# for reverse relationship: txn.source_card and txn.recipient_card

class Transaction(db.Model):
	__tablename__ = 'transactions'
	id                 = db.Column(db.Integer, primary_key=True)
	user_id            = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
	type               = db.Column(db.Enum(TransactionType), nullable=False)
	source_card_id     = db.Column(db.Integer, db.ForeignKey('ecards.id'), nullable=False)
	recipient_card_id  = db.Column(db.Integer, db.ForeignKey('ecards.id'), nullable=True)
	amount             = db.Column(db.Float, nullable=False)
	description        = db.Column(db.String(200), nullable=True)
	timestamp          = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)

	source_card     = db.relationship('ECard', foreign_keys=[source_card_id])
	recipient_card  = db.relationship('ECard', foreign_keys=[recipient_card_id])
