'use client';

interface RecipeImageProps {
  imageUrl: string;
  title: string;
  onImageClick: () => void;
}

export default function RecipeImage({ imageUrl, title, onImageClick }: RecipeImageProps) {
  const handleImageClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onImageClick();
  };

  return (
    <div className="lg:w-1/3">
      <div 
        className="relative rounded-2xl overflow-hidden shadow-lg border border-gray-200 cursor-pointer group transition-transform duration-300 hover:scale-105"
        onClick={handleImageClick}
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-64 lg:h-80 object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const parent = target.parentElement;
            if (parent) {
              parent.innerHTML = '<div class="w-full h-64 lg:h-80 bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-4xl cursor-pointer">🍽️</div>';
              parent.onclick = () => onImageClick();
            }
          }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center pointer-events-none">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 rounded-full p-3">
            <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
} 