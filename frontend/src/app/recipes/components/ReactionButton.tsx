'use client';

import { useState } from 'react';

export default function ReactionButton() {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isBouncing, setIsBouncing] = useState(false);

  const handleLike = () => {
    if (!liked) {
      setLikes((prev) => prev + 1);
      setLiked(true);
      setIsBouncing(true);

      setTimeout(() => {
        setIsBouncing(false);
      }, 400); // 0.2秒後に戻す
    }
  };

  return (
    <div className="mb-6">
      <button
        onClick={handleLike}
        className="bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold px-6 py-2 rounded-full shadow hover:opacity-90 transition"
      >
        <span
          className={`inline-block transform transition-transform duration-200 ease-out ${
            isBouncing ? 'scale-200' : 'scale-100'
          }`}
        >
          ❤️
        </span>{' '}
        いいね {likes > 0 && `(${likes})`}
      </button>
    </div>
  );
}