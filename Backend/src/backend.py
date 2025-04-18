# backend/app.py
from flask import Flask, jsonify, request, session
from flask_cors import CORS
from sqlalchemy.exc import IntegrityError
import hashlib

from config import Config
from models import db, User, ECard, Transaction, TransactionType

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

	@app.route("/api/users", methods=["GET"])
	def get_users():
		users = db.session.query(User)
		return jsonify([{'id': u.id, 'email': u.email} for u in users])

	return app

if __name__ == "__main__":
	app = create_app()
	with app.app_context():
		db.create_all()
	app.run(debug=True, port=5000)
