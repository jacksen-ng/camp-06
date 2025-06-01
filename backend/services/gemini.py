import os
import google.generativeai as genai
from dotenv import load_dotenv

# .env から APIキーを読み込む
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY が .env に設定されていません。")


genai.configure(api_key=api_key)
model = genai.GenerativeModel("models/gemini-1.5-flash-latest", generation_config={"temperature": 0.8})

async def generate_recipe(ingredients: list[str]) -> str:
    if not ingredients:
        raise ValueError("食材リストが空です。")

    ingredients_str = ", ".join(ingredients)
    prompt = f"""
    以下の食材を使って、架空の国家の料理を1つ作ってください。

    【使用する食材】
    {ingredients_str}

    【出力形式】
    国家名（架空国家名）:
    料理名（オリジナルで現実に存在しない名前）:
    材料（数量も）:
    手順（1,2,3の箇条書きで）:

    ※余計な説明は不要です。ナレーション風ではなく、レシピサービスのように淡々と出力してください。
    """


    response = model.generate_content(prompt)
    return response.text