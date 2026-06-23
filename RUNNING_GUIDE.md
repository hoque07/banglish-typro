# BANGLISH TYPRO V1 Running Guide

## 1. Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Open:

```txt
http://127.0.0.1:8000/docs
```

## 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open:

```txt
http://localhost:5173
```

## 3. Test account

You can register from the UI.

Example:
- Name: Tanbir Nebir
- Email: demo@banglish.com
- Password: 123456

## 4. Important

Keep backend running while using frontend.
