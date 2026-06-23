import hashlib
import uuid
from datetime import datetime
from fastapi import Header, HTTPException
from app.db import get_connection

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def create_user(name: str, email: str, password: str):
    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            "INSERT INTO users (name, email, password_hash, created_at) VALUES (?, ?, ?, ?)",
            (name, email.lower(), hash_password(password), datetime.utcnow().isoformat())
        )
        conn.commit()
    except Exception as exc:
        conn.close()
        raise HTTPException(status_code=400, detail="User already exists or invalid data")

    user_id = cursor.lastrowid
    token = create_session(user_id)
    conn.close()

    return {"token": token, "user": {"id": user_id, "name": name, "email": email.lower()}}

def create_session(user_id: int) -> str:
    token = str(uuid.uuid4())
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)",
        (token, user_id, datetime.utcnow().isoformat())
    )
    conn.commit()
    conn.close()
    return token

def login_user(email: str, password: str):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE email = ? AND password_hash = ?",
        (email.lower(), hash_password(password))
    )
    user = cursor.fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    token = create_session(user["id"])
    return {"token": token, "user": {"id": user["id"], "name": user["name"], "email": user["email"]}}

def get_current_user(authorization: str = Header(default="")):
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")

    token = authorization.replace("Bearer ", "").strip()

    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        '''
        SELECT users.id, users.name, users.email
        FROM sessions
        JOIN users ON users.id = sessions.user_id
        WHERE sessions.token = ?
        ''',
        (token,)
    )
    user = cursor.fetchone()
    conn.close()

    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    return {"id": user["id"], "name": user["name"], "email": user["email"]}
