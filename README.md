# BANGLISH TYPRO V1 PRODUCTION SAAS

BANGLISH TYPRO is a full-stack Banglish to Bangla writing assistant.

## V1 Features

- React + Vite frontend
- FastAPI backend
- Banglish to Bangla conversion API
- Smart suggestion engine
- Word guide system
- Alphabet guide
- Bangla punctuation guide
- Sentence generator
- Login and register system
- SQLite database
- Saved conversion history
- Blue-white SaaS UI
- Smooth animations
- Responsive layout
- Footer portfolio credit

## Run Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend URL:

```txt
http://127.0.0.1:8000
```

API Docs:

```txt
http://127.0.0.1:8000/docs
```

## Run Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend URL:

```txt
http://localhost:5173
```

## Developer Credit

Made by Tanbir Nebir.
Update the portfolio link inside `frontend/src/components/Footer.jsx`.
