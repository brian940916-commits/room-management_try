import type { Lang, Review } from '../types/property';

interface ReviewCardProps {
  review: Review;
  lang: Lang;
}

export function ReviewCard({ review, lang }: ReviewCardProps) {
  return (
    <div className="bg-gray-50 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-sm">
            {review.author[0]}
          </div>
          <span className="font-medium text-gray-800 text-sm">{review.author}</span>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
          ))}
        </div>
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">
        {lang === 'zh' ? review.commentZh : review.commentEn}
      </p>
      <p className="text-xs text-gray-400 mt-2">{review.date}</p>
    </div>
  );
}
