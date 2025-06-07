from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from db.database import get_db
from services.comment import create_comment, get_comments_by_recipe

router = APIRouter(prefix="/comments", tags=["comment"])

@router.post("/{recipe_id}")
def post_comment(recipe_id: int, commenter_id: int, comment_text: str, db: Session = Depends(get_db)):
    """
    レシピにコメントを投稿するエンドポイント。
    Parameters:
        recipe_id: int（レシピのID）
        commenter_id: int（コメント投稿者のユーザーID）
        comment_text: str（コメント内容）
        db: DBセッション（自動依存注入）
    Returns:
        成功メッセージ
    """
    create_comment(db, recipe_id, commenter_id, comment_text)
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