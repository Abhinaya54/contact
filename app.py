from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from datetime import datetime, timezone
import re

app = Flask(__name__)

# MongoDB Atlas connection
client = MongoClient("mongodb+srv://abhinayapulagam_db_user:69Gm5TSVTfyadmC3@cluster0.xxyzbss.mongodb.net/?appName=Cluster0")
db = client["contact_manager"]
contacts_col = db["contacts"]

# email and phone validation patterns
EMAIL_RE = re.compile(r"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$")
PHONE_RE = re.compile(r"^\+?[1-9]\d{6,14}$")


# generate ID like C001, C002, C003...
def get_next_id():
    last = contacts_col.find_one({}, sort=[("_id", -1)])
    if not last or not last.get("contact_id"):
        return "C001"
    num = int(last["contact_id"][1:]) + 1
    return "C" + str(num).zfill(3)


# home page
@app.route("/")
def home():
    return render_template("index.html")


# READ - get all contacts
@app.route("/api/contacts", methods=["GET"])
def get_contacts():
    all_contacts = list(contacts_col.find({}, {"_id": 0}))
    return jsonify(all_contacts)


# CREATE - add new contact
@app.route("/api/contacts", methods=["POST"])
def add_contact():
    data = request.get_json()

    first   = data.get("first_name", "").strip()
    last    = data.get("last_name", "").strip()
    email   = data.get("email", "").strip().lower()
    phone   = data.get("phone", "").strip()
    address = data.get("address", "").strip()

    # validate all fields
    errors = {}
    if not first:
        errors["first_name"] = "First name is required."
    if not last:
        errors["last_name"] = "Last name is required."
    if not email:
        errors["email"] = "Email is required."
    elif not EMAIL_RE.match(email):
        errors["email"] = "Enter a valid email address."
    if not phone:
        errors["phone"] = "Phone number is required."
    elif not PHONE_RE.match(phone.replace(" ", "")):
        errors["phone"] = "Enter a valid phone number."
    if not address:
        errors["address"] = "Address is required."

    if errors:
        return jsonify({"ok": False, "errors": errors}), 422

    # check duplicate email
    if contacts_col.find_one({"email": email}):
        return jsonify({"ok": False, "errors": {"email": "This email is already registered."}}), 409

    # check duplicate phone
    if contacts_col.find_one({"phone": phone}):
        return jsonify({"ok": False, "errors": {"phone": "This phone number already exists."}}), 409

    now = datetime.now(timezone.utc).strftime("%d %b %Y, %I:%M %p")

    new_contact = {
        "contact_id": get_next_id(),
        "first_name": first,
        "last_name":  last,
        "email":      email,
        "phone":      phone,
        "address":    address,
        "created_at": now,
        "updated_at": now
    }

    contacts_col.insert_one(new_contact)
    new_contact.pop("_id", None)
    return jsonify({"ok": True, "contact": new_contact}), 201


# UPDATE - edit a contact
@app.route("/api/contacts/<contact_id>", methods=["PUT"])
def update_contact(contact_id):
    data = request.get_json()

    first   = data.get("first_name", "").strip()
    last    = data.get("last_name", "").strip()
    email   = data.get("email", "").strip().lower()
    phone   = data.get("phone", "").strip()
    address = data.get("address", "").strip()

    errors = {}
    if not first:
        errors["first_name"] = "First name is required."
    if not last:
        errors["last_name"] = "Last name is required."
    if not email:
        errors["email"] = "Email is required."
    elif not EMAIL_RE.match(email):
        errors["email"] = "Enter a valid email address."
    if not phone:
        errors["phone"] = "Phone number is required."
    elif not PHONE_RE.match(phone.replace(" ", "")):
        errors["phone"] = "Enter a valid phone number."
    if not address:
        errors["address"] = "Address is required."

    if errors:
        return jsonify({"ok": False, "errors": errors}), 422

    # duplicate check - skip current contact
    if contacts_col.find_one({"email": email, "contact_id": {"$ne": contact_id}}):
        return jsonify({"ok": False, "errors": {"email": "This email is used by another contact."}}), 409

    if contacts_col.find_one({"phone": phone, "contact_id": {"$ne": contact_id}}):
        return jsonify({"ok": False, "errors": {"phone": "This phone is used by another contact."}}), 409

    now = datetime.now(timezone.utc).strftime("%d %b %Y, %I:%M %p")

    contacts_col.update_one(
        {"contact_id": contact_id},
        {"$set": {
            "first_name": first,
            "last_name":  last,
            "email":      email,
            "phone":      phone,
            "address":    address,
            "updated_at": now
        }}
    )
    return jsonify({"ok": True})


# DELETE - remove a contact
@app.route("/api/contacts/<contact_id>", methods=["DELETE"])
def delete_contact(contact_id):
    result = contacts_col.delete_one({"contact_id": contact_id})
    if result.deleted_count == 0:
        return jsonify({"ok": False, "message": "Contact not found."}), 404
    return jsonify({"ok": True})


# STATS - dashboard numbers
@app.route("/api/stats", methods=["GET"])
def get_stats():
    total = contacts_col.count_documents({})
    return jsonify({"total": total})


if __name__ == "__main__":
    app.run(debug=True)