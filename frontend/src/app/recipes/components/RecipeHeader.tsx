'use client';

interface RecipeHeaderProps {
  title: string;
  country?: string;
  imageDescription?: string;
  user_name?: string;
}

export default function RecipeHeader({ title, country, imageDescription, user_name }: RecipeHeaderProps) {
  return (
    <div className="lg:w-2/3">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          {title}
        </h1>
        {country && (
          <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-semibold">
            {country}
          </span>
        )}
      </div>
      {user_name && (
        <p className="text-sm text-gray-500 mb-2">
          投稿者: {user_name}
        </p>
      )}
      {imageDescription && (
        <p className="text-lg text-gray-600 italic mb-4">
          {imageDescription}
        </p>
      )}
    </div>
  );
} 