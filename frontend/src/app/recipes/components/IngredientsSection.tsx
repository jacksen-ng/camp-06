'use client';

interface IngredientsSectionProps {
  ingredients: string[];
}

export default function IngredientsSection({ ingredients }: IngredientsSectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
        🥘 材料
      </h2>
      <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
        {ingredients.length > 0 ? (
          <ul className="space-y-3">
            {ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center gap-3">
                <span className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0"></span>
                <span className="text-gray-700 font-medium">{ingredient}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">材料情報がありません</p>
        )}
      </div>
    </div>
  );
} 