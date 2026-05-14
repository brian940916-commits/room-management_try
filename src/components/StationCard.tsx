import type { Lang } from '../types/property';
import type { Station } from '../types/property';

interface StationCardProps {
  station: Station;
  lang: Lang;
  onClick: (stationId: string) => void;
}

export function StationCard({ station, lang, onClick }: StationCardProps) {
  return (
    <button
      onClick={() => onClick(station.id)}
      className="group bg-white rounded-card shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden text-left w-full"
    >
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-6 flex items-center justify-center">
        <span className="text-5xl group-hover:scale-110 transition-transform duration-200">
          {station.coverEmoji}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-base">
          {lang === 'zh' ? station.zh : station.en}
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">{station.line}</p>
        <div className="mt-3 space-y-1">
          {station.attractions.slice(0, 2).map(a => (
            <div key={a.nameZh} className="flex items-center gap-1.5 text-xs text-gray-500">
              <span>{a.icon}</span>
              <span>{lang === 'zh' ? a.nameZh : a.nameEn}</span>
              <span className="text-gray-300">·</span>
              <span>{a.distMin}min</span>
            </div>
          ))}
        </div>
      </div>
    </button>
  );
}
