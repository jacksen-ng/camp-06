#テーブルの初期化
#Dockerを起動する上で、python init_db.pyを実行してください
from db.database import engine, Base
from db.models import User, Recipe  # Recipe模型も导入

def create_tables():
    """テーブル初期化"""
    print("テーブル初期化中...")
    Base.metadata.drop_all(bind=engine)  # 既存のテーブルを削除
    Base.metadata.create_all(bind=engine)  # 新しいテーブルを作成
    print("テーブル初期化完了！")

if __name__ == "__main__":
    create_tables() 