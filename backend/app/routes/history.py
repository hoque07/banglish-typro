from datetime import datetime
from fastapi import APIRouter, Depends
from app.db import get_connection
from app.models import HistoryCreateRequest
from app.services.auth_service import get_current_user

router = APIRouter(prefix="/history", tags=["History"])

@router.post("")
def save_history(req: HistoryCreateRequest, user = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO conversion_history (user_id, input_text, output_text, created_at) VALUES (?, ?, ?, ?)",
        (user["id"], req.input_text, req.output_text, datetime.utcnow().isoformat())
    )
    conn.commit()
    conn.close()
    return {"message": "History saved"}

@router.get("")
def list_history(user = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, input_text, output_text, created_at FROM conversion_history WHERE user_id = ? ORDER BY id DESC LIMIT 20",
        (user["id"],)
    )
    rows = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return {"history": rows}

@router.delete("/{history_id}")
def delete_history(history_id: int, user = Depends(get_current_user)):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute(
        "DELETE FROM conversion_history WHERE id = ? AND user_id = ?",
        (history_id, user["id"])
    )
    conn.commit()
    conn.close()
    return {"message": "History deleted"}
