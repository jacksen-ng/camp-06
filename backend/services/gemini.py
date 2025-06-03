import os
import base64
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.prompts import ChatPromptTemplate

# .env から APIキーを読み込む
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("GEMINI_API_KEY が .env に設定されていません。")

# テキスト生成用のLangchain Gemini AI
llm_text = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash-latest",
    google_api_key=api_key,
    temperature=0.8
)

# 画像生成用のLangchain Gemini AI
llm_image = ChatGoogleGenerativeAI(
    model="models/gemini-2.0-flash-preview-image-generation",
    google_api_key=api_key
)

def _get_image_base64(response: AIMessage) -> str | None:
    """AIMessageレスポンスからbase64画像データを抽出"""
    try:
        for block in response.content:
            if isinstance(block, dict) and block.get("image_url"):
                return block["image_url"].get("url")
        return None
    except Exception:
        return None

async def generate_recipe(ingredients: list[str]) -> dict:
    if not ingredients:
        raise ValueError("食材リストが空です。")

    ingredients_str = ", ".join(ingredients)
    
    # レシピ生成用のプロンプト
    recipe_prompt = ChatPromptTemplate.from_messages([
        ("human", """
        以下の食材を使って、架空の国家の料理を1つ作ってください。

        【使用する食材】
        {ingredients}

        【出力形式】
        国家名（架空国家名）:
        料理名（オリジナルで現実に存在しない名前）:
        材料（数量も）:
        手順（1,2,3の箇条書きで）:

        ※余計な説明は不要です。ナレーション風ではなく、レシピサービスのように淡々と出力してください。
        """)
    ])

    try:
        # レシピ生成
        recipe_chain = recipe_prompt | llm_text
        recipe_response = await recipe_chain.ainvoke({"ingredients": ingredients_str})
        recipe_text = recipe_response.content

        # レシピから料理名を抽出
        dish_name_prompt = ChatPromptTemplate.from_messages([
            ("human", """
            以下のレシピから料理名のみを抽出してください。

            レシピ: {recipe_text}
            
            料理名のみを出力してください。
            """)
        ])
        
        dish_chain = dish_name_prompt | llm_text
        dish_response = await dish_chain.ainvoke({"recipe_text": recipe_text})
        dish_name = dish_response.content.strip()

        # 画像生成用のメッセージ
        image_message = {
            "role": "user",
            "content": f"Generate a photorealistic, appetizing image of a dish called '{dish_name}' made with {ingredients_str}. The dish should look delicious and professionally plated on a beautiful dish. High quality food photography style."
        }

        # 画像生成
        image_response = llm_image.invoke(
            [image_message],
            generation_config=dict(response_modalities=["TEXT", "IMAGE"]),
        )

        # 画像のbase64データを取得
        image_base64 = _get_image_base64(image_response)

        # 画像説明も生成
        image_description_prompt = ChatPromptTemplate.from_messages([
            ("human", """
            以下のレシピに基づいて、完成した料理の見た目を詳細に描写してください。
            色彩、盛り付け、食材の配置など、視覚的な特徴を具体的に説明してください。

            レシピ: {recipe_text}

            出力は日本語で、料理の外観のみを200文字程度で簡潔に描写してください。
            """)
        ])

        description_chain = image_description_prompt | llm_text
        description_response = await description_chain.ainvoke({"recipe_text": recipe_text})
        image_description = description_response.content

        return {
            "recipe": recipe_text,
            "image_description": image_description,
            "has_image": image_base64 is not None,
            "image_url": image_base64,
            "dish_name": dish_name
        }

    except Exception as e:
        print(f"エラー: {str(e)}")
        # エラーが発生した場合は、基本的なレスポンスを返す
        return {
            "recipe": "レシピ生成に失敗しました",
            "image_description": "画像生成に失敗しました", 
            "has_image": False,
            "image_url": None,
            "dish_name": "不明"
        }