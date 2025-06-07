from db.models import Comment, User
from sqlalchemy.orm import Session

def create_comment(db: Session, recipe_id: int, commenter_id: int, comment_text: str):
    db_comment = Comment(
        recipe_id=recipe_id,
        commenter_id=commenter_id,
        comment_text=comment_text
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    return db_comment

def get_comments_by_recipe(db: Session, recipe_id: int):
    db_comments = (
        db.query(Comment, User)
        .join(User, Comment.commenter_id == User.id)
        .filter(Comment.recipe_id == recipe_id)
        .all()
    )
    comments = []
    for comment, user in db_comments:
        comment_dict = {
            "id": comment.id,
            "recipe_id": comment.recipe_id,
            "commenter_id": comment.commenter_id,
            "comment_text": comment.comment_text,
            "user_name": user.user_name  # ここでユーザー名を追加
        }
        comments.append(comment_dict)
    return comments

def delete_comment(db: Session, comment_id: int):
    db_comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if db_comment:
        db.delete(db_comment)
        db.commit()
        return {"message": "コメントが削除されました"}
    else:
        return {"message": "コメントが見つかりませんでした"}