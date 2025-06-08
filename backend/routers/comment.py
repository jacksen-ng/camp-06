from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from services.comment import create_comment, get_comments_by_recipe
from services.auth import get_current_user
from db.models import User
from pydantic import BaseModel

router = APIRouter(prefix="/comments", tags=["comment"])

class CommentCreate(BaseModel):
    comment_text: str

@router.post("/{recipe_id}")
def post_comment(recipe_id: int, comment: CommentCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    """
    レシピにコメントを投稿するエンドポイント。
    Parameters:
        recipe_id: int（レシピのID）
        current_user: User（現在のユーザー情報）
        comment_text: str（コメント内容）
        db: DBセッション（自動依存注入）
    Returns:
        成功メッセージ
    """
    create_comment(db, recipe_id, current_user.id, comment.comment_text)
    return {"message": "コメントが投稿されました"}

@router.get("/{recipe_id}")
def get_comments(recipe_id: int, db: Session = Depends(get_db)):
    """
    レシピに対するコメントを取得するエンドポイント。
    Parameters:
        recipe_id: int（レシピのID）
        db: DBセッション（自動依存注入）
    Returns:
        コメントのリスト
    """
    comments = get_comments_by_recipe(db, recipe_id)
    return comments

@router.delete("/{comment_id}")
def delete_comment(comment_id: int, db: Session = Depends(get_db)):
    """
    コメントを削除するエンドポイント。
    Parameters:
        comment_id: int（削除するコメントのID）
        db: DBセッション（自動依存注入）
    Returns:
        成功メッセージ
    """
    result = delete_comment(db, comment_id)
    return result