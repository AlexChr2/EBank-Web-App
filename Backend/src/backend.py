# backend/app.py
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from sqlalchemy.exc import IntegrityError, DatabaseError
import hashlib
from functools import wraps

from config import Config
from models import db, User, ECard, Transaction, TransactionType

# decorator function
def login_required(f):
	@wraps(f)
	def decorated_function(*args, **kwargs):
		if session.get("user_id") is None:
			return jsonify({"error": "User not signed in!"}), 401
		return f(*args, **kwargs)
	return decorated_function

def create_app():
	app = Flask(__name__)
	app.config.from_object(Config)
	app.secret_key = "abcdef123456#"
	CORS(app, supports_credentials = True)  # allow requests from different origins (like localhost:5173)

	db.init_app(app)

	@app.route("/api/create-user", methods=["POST"])
	def create_user():
		data = request.get_json()
		email = data.get("email")
		password = data.get("password")

		if not email or not password:
			return jsonify({"error": "Missing fields"}), 400

		hashedpw = hashlib.sha256(password.encode()).hexdigest()
		new_user = User(email = email, password = hashedpw)
		db.session.add(new_user)

		try:
			db.session.commit()
		except IntegrityError:
			db.session.rollback()
			return jsonify({"error": "Email already exists"}), 409

		session["user_id"] = new_user.id
		return jsonify({"success": True, "email": email}), 201

	@app.route("/api/login", methods=["POST"])
	def login():
		data = request.json
		if not data:
			return jsonify({"error": "Invalid or missing JSON"}), 400

		email = data.get("email")
		password = data.get("password")

		if not email or not password:
			return jsonify({"error": "Missing fields"}), 400

		hashedpw = hashlib.sha256(password.encode()).hexdigest()

		from sqlalchemy import select
		stmt = select(User).where(User.email == email)
		user = db.session.execute(stmt).scalars().first()

		if not user:
			return jsonify({"error": "User not found"}), 404

		if user.password != hashedpw:
			return jsonify({"error": "Incorrect password"}), 401  # Unauthorized

		session["user_id"] = user.id
		return jsonify({"id": user.id, "email": user.email}), 200

	@app.route("/api/logout", methods=["POST"])
	def logout():
		session["user_id"] = None
		return jsonify({"success": True}), 201

	# automatically make this card for the user that's signed in
	@app.route("/api/create-card", methods=["POST"])
	@login_required
	def create_card():
		data = request.json
		if not data:
			return jsonify({"error": "Missing fields"}), 400

		name = data.get("name")
		if not name:
			return jsonify({"error": "Missing card name"}), 400
		new_card = ECard(user_id = session.get("user_id"), name = name)
		db.session.add(new_card)
		try:
			db.session.commit()
		except IntegrityError:
			db.session.rollback()
			return jsonify({"error": "Unknown Integrity Error"}), 400
		return jsonify({"success": True, "card_id": new_card.id}), 201

	@app.route("/api/rename-card", methods=["PUT"])
	@login_required
	def rename_card():
		data = request.json
		if not data:
			return jsonify({"error": "Missing fields"}), 400

		card_id = int(data.get("card_id"))
		new_name = data.get("new_card_name")
		if not card_id:
			return jsonify({"error": "Missing card ID"}), 400
		if not new_name:
			return jsonify({"error": "Missing new card name"}), 400
		from sqlalchemy import select
		stmt = select(ECard).where(ECard.id == card_id)
		ecard = db.session.execute(stmt).scalars().first()

		if ecard:
			ecard.name = new_name
			try:
				db.session.commit()
			except DatabaseError:
				db.session.rollback()
				return jsonify({"error": "Unknown database error!"})
			return jsonify({"success": True}), 201
		else:
			return jsonify({"error": "Failed to find card"})

	@app.route("/api/delete-card", methods=["DELETE"])
	@login_required
	def delete_card():
		data = request.json
		if not data or data.get("card_id") is None:
			return jsonify({"error": "Missing fields"}), 401

		card_id = int(data.get("card_id"))

		from sqlalchemy import select
		stmt = select(ECard).where(ECard.id == card_id)
		ecard = db.session.execute(stmt).scalars().first()

		if ecard:
			db.session.delete(ecard)
			try:
				db.session.commit()
			except DatabaseError:
				db.session.rollback()
				return jsonify({"error": "Unknown database error"})
		else:
			return jsonify({"error": "Failed to find card"})

		def anonymize_field(model_class, filter_field, update_field, filter_value, update_value):
			stmt = select(model_class).where(filter_field == filter_value)
			records = db.session.execute(stmt).scalars().all()
			for record in records:
				setattr(record, update_field.key, update_value)
			try:
				db.session.commit()
			except DatabaseError:
				db.session.rollback()
				return jsonify({"error": "Unknown database error"})

		# when removing a card, make sure to change all of its transactions to
		# an anonymous state
		anonymize_field(
			Transaction,
			Transaction.source_card_id,
			Transaction.source_card_id,
			card_id,
			-1
		)
		anonymize_field(
			Transaction,
			Transaction.recipient_card_id,
			Transaction.recipient_card_id,
			card_id,
			-1
		)
		return jsonify({"success": True}), 201

	@app.route("/api/my-cards", methods=["GET"])
	@login_required
	def get_cards():
		from sqlalchemy import select
		stmt = select(ECard).where(ECard.user_id == session.get("user_id"))
		cards = db.session.execute(stmt).scalars().all()
		return jsonify([{'id': c.id, 'name': c.name, 'balance': c.cash_amount} for c in cards])

	@app.route("/api/make-transaction", methods=["POST"])
	@login_required
	def make_transaction():
		data = request.json
		if not data:
			return jsonify({"error": "Missing fields"}), 401

		transactiontype = data.get("type")
		source_card_id = data.get("source_card_id")
		recipient_card_id = data.get("recipient_card_id")
		amount = data.get("amount")
		desc = data.get("description")
		if all(x is None for x in [
			transactiontype, source_card_id, amount, desc
		]):
			return jsonify({"error": "Missing arguments"}), 400

		if transactiontype == "transfer" and recipient_card_id is None:
			return jsonify({"error": "Recipient card ID required for transfer!"}), 400

		newTransaction = Transaction(
			user_id = session.get("user_id"),
			type = transactiontype,
			source_card_id = source_card_id,
			recipient_card_id = recipient_card_id,
			amount = amount,
			description = desc
		)
		db.session.add(newTransaction)

		# now update the balance of both source_card and recipient_card (if exists)
		from sqlalchemy import select
		stmt = select(ECard).where(ECard.id == source_card_id)
		source_card = db.session.execute(stmt).scalars().first()
		if transactiontype == "deposit":
			source_card.cash_amount += amount
		else:
			source_card.cash_amount -= amount

		if recipient_card_id is not None: # if it's a transfer
			from sqlalchemy import select
			stmt = select(ECard).where(ECard.id == recipient_card_id)
			recipient_card = db.session.execute(stmt).scalars().first()
			recipient_card.cash_amount += amount

		# commit both changes at once, if one fails, rollback
		try:
			db.session.commit()
		except IntegrityError:
			db.session.rollback()
			return jsonify({"error": "Unknown integrity error"}), 400

		return jsonify({"success": True}), 201

	@app.route("/api/get-transactions", methods=["GET"])
	@login_required
	def get_transactions():
		from sqlalchemy import select
		stmt = (select(Transaction)
			.where(Transaction.user_id == session.get("user_id"))
			.order_by(Transaction.timestamp.desc())
		)
		transactions = db.session.execute(stmt).scalars().all()
		return jsonify([{
			'id': t.id,
			'type': t.type.value,
			'walletId': t.source_card_id,
			'recipientWalletId': t.recipient_card_id,
			'amount': t.amount,
			'description': t.description,
			'createdAt': t.timestamp
		} for t in transactions])

	@app.route("/api/get-users", methods=["GET"])
	def get_users():
		users = db.session.query(User)
		return jsonify([{'id': u.id, 'email': u.email} for u in users])

	@app.route("/api/delete-user", methods=["DELETE"])
	@login_required
	def delete_user():
		data = request.json
		if not data or data.get("user_id") is None:
			return jsonify({"error": "Missing fields"}), 401

		user_id = int(data.get("user_id"))

		def delete_user_info(model_class, filter_field, filter_value):
			from sqlalchemy import delete
			stmt = delete(model_class).where(filter_field == filter_value)
			try:
				db.session.execute(stmt)
				db.session.commit()
			except DatabaseError:
				db.session.rollback()
				return jsonify({"error": "Unknown database error"}), 401

		# when deleting a user, we also have to delete all his transactions & ecards
		delete_user_info(Transaction, Transaction.user_id, user_id)
		delete_user_info(ECard, ECard.user_id, user_id)

		from sqlalchemy import select
		stmt = select(User).where(User.id == user_id)
		user = db.session.execute(stmt).scalars().first()

		if user:
			db.session.delete(user)
			try:
				db.session.commit()
			except DatabaseError:
				db.session.rollback()
				return jsonify({"error": "Unknown database error"}), 401
		else:
			return jsonify({"error": "Failed to find user"}), 401
		return jsonify({"success": True}), 201

	return app

if __name__ == "__main__":
	app = create_app()
	with app.app_context():
		db.create_all()
	app.run(debug=True, port=5000)
