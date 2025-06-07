'use client';

interface ImageModalProps {
  isOpen: boolean;
  imageUrl: string;
  title: string;
  onClose: () => void;
}

export default function ImageModal({ isOpen, imageUrl, title, onClose }: ImageModalProps) {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="relative max-w-5xl max-h-full">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors z-10"
          aria-label="画像を閉じる"
          title="画像を閉じる"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div 
          className="rounded-2xl overflow-hidden shadow-2xl max-w-full max-h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={imageUrl}
            alt={title}
            className="max-w-full max-h-[90vh] object-contain rounded-2xl"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                parent.innerHTML = '<div class="w-96 h-96 bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-6xl rounded-2xl">🍽️</div>';
              }
            }}
          />
        </div>
      </div>
    </div>
  );
} 