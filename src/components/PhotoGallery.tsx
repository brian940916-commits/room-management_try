import { useState } from 'react';

interface PhotoGalleryProps {
  photos: string[];
  altBase: string;
}

const gradients = [
  'from-blue-400 to-indigo-600',
  'from-teal-400 to-cyan-600',
  'from-violet-400 to-purple-600',
];

export function PhotoGallery({ photos, altBase }: PhotoGalleryProps) {
  const [current, setCurrent] = useState(0);

  if (photos.length === 0) {
    return (
      <div className={`w-full h-72 sm:h-96 rounded-2xl bg-gradient-to-br ${gradients[0]} flex items-center justify-center`}>
        <span className="text-6xl">🏨</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="relative rounded-2xl overflow-hidden h-72 sm:h-96 bg-gray-100">
        <img
          src={photos[current]}
          alt={`${altBase} ${current + 1}`}
          loading="lazy"
          className="w-full h-full object-cover"
        />
        {photos.length > 1 && (
          <>
            <button
              onClick={() => setCurrent(c => (c - 1 + photos.length) % photos.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-colors shadow"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrent(c => (c + 1) % photos.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 backdrop-blur rounded-full flex items-center justify-center text-gray-800 hover:bg-white transition-colors shadow"
            >
              ›
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-colors ${i === current ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {photos.length > 1 && (
        <div className="flex gap-2 mt-3">
          {photos.map((src, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors flex-shrink-0 ${
                i === current ? 'border-primary-600' : 'border-transparent'
              }`}
            >
              <img src={src} alt="" loading="lazy" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
