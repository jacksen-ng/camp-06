'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { recipeApi, Recipe } from '@/app/lib/api';
import { useAuth } from '@/app/contexts/AuthContext';
import RecipeHeader from '@/app/recipes/components/RecipeHeader';
import RecipeImage from '@/app/recipes/components/RecipeImage';
import ImageModal from '@/app/recipes/components/ImageModal';
import IngredientsSection from '@/app/recipes/components/IngredientsSection';
import InstructionsSection from '@/app/recipes/components/InstructionsSection';
import LoadingSpinner from '@/error/LoadingSpinner';
import ErrorMessage from '@/error/ErrorMessage';

export default function RecipeDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!isAuthenticated) {
        setError('ログインが必要です');
        setLoading(false);
        return;
      }

      try {
        const data = await recipeApi.getRecipe(Number(params.id));
        setRecipe(data);
      } catch (error: any) {
        if (error.message.includes('404')) {
          setError('レシピが見つかりませんでした');
        } else {
          setError('レシピの取得に失敗しました');
        }
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchRecipe();
    }
  }, [params.id, isAuthenticated]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsImageModalOpen(false);
      }
    };

    if (isImageModalOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isImageModalOpen]);

  const openImageModal = () => {
    setIsImageModalOpen(true);
  };

  const closeImageModal = () => {
    setIsImageModalOpen(false);
  };

  if (loading) {
    return <LoadingSpinner message="レシピを読み込み中..." />;
  }

  if (error) {
    return <ErrorMessage error={error} isAuthenticated={isAuthenticated} />;
  }

  if (!recipe) {
    return null;
  }

  const ingredientsArray = recipe.ingredients || [];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <button
            onClick={() => router.back()}
            className="mb-6 flex items-center gap-2 text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            ← 戻る
          </button>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-white/20">
            <div className="p-8 md:p-12">
              <div className="flex flex-col lg:flex-row gap-8 mb-8">
                <RecipeHeader 
                  title={recipe.title}
                  country={recipe.country}
                  imageDescription={recipe.image_description}
                />

                {recipe.image_url && (
                  <RecipeImage 
                    imageUrl={recipe.image_url}
                    title={recipe.title}
                    onImageClick={openImageModal}
                  />
                )}
              </div>

              <div className="grid lg:grid-cols-2 gap-8">
                <IngredientsSection ingredients={ingredientsArray} />
                <InstructionsSection instructions={recipe.instructions} />
              </div>

              <div className="mt-8 text-center">
                <button
                  onClick={() => router.push('/top-page')}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg"
                >
                  他のレシピを見る
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {recipe?.image_url && (
        <ImageModal 
          isOpen={isImageModalOpen}
          imageUrl={recipe.image_url}
          title={recipe.title}
          onClose={closeImageModal}
        />
      )}
    </>
  );
} 