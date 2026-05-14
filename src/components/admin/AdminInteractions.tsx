import { useState, useCallback } from 'react';
import { getAllProperties, isReviewHidden, toggleReviewVisibility, getCannedResponses, setCannedResponses } from '../../data/adminStore';
import type { CannedResponses } from '../../types/admin';

export function AdminInteractions() {
  const allProps = getAllProperties().filter(p => (p.status ?? 'active') === 'active');
  const [hiddenMap, setHiddenMap] = useState<Record<string, boolean>>({});
  const [canned, setCanned] = useState<CannedResponses>(() => getCannedResponses());
  const [editCanned, setEditCanned] = useState(false);
  const [cannedDraft, setCannedDraft] = useState<CannedResponses>({ zh: [], en: [] });
  const [activeTab, setActiveTab] = useState<'reviews' | 'canned'>('reviews');

  const refresh = useCallback(() => {
    const map: Record<string, boolean> = {};
    allProps.forEach(p => {
      p.reviews.forEach((_, i) => {
        if (isReviewHidden(p.id, i)) map[`${p.id}_${i}`] = true;
      });
    });
    setHiddenMap(map);
  }, [allProps]);

  useState(() => { refresh(); });

  function handleToggle(propId: number, idx: number) {
    toggleReviewVisibility(propId, idx);
    refresh();
  }

  function openEditCanned() {
    setCannedDraft({ zh: [...canned.zh], en: [...canned.en] });
    setEditCanned(true);
  }

  function saveCanned() {
    setCannedResponses(cannedDraft);
    setCanned(cannedDraft);
    setEditCanned(false);
  }

  const allReviews = allProps.flatMap(p =>
    p.reviews.map((r, i) => ({ prop: p, review: r, idx: i, key: `${p.id}_${i}` }))
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">互動管理</h1>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1 w-fit mb-6 gap-1">
        {[
          { id: 'reviews', label: '顧客評價' },
          { id: 'canned',  label: '罐頭回覆設定' },
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id as 'reviews' | 'canned')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews tab */}
      {activeTab === 'reviews' && (
        <div className="bg-white rounded-2xl shadow-card overflow-hidden">
          {allReviews.length === 0 ? (
            <p className="text-center py-16 text-gray-400">目前無評價</p>
          ) : (
            <div className="divide-y divide-gray-50">
              {allReviews.map(({ prop, review, idx, key }) => {
                const hidden = hiddenMap[key];
                return (
                  <div key={key} className={`p-5 ${hidden ? 'opacity-50' : ''}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-gray-400">{prop.name.zh}</span>
                          <span className="text-gray-200">·</span>
                          <div className="flex">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-gray-200'}`}>★</span>
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">{review.date}</span>
                        </div>
                        <p className="font-medium text-gray-800 text-sm">{review.author}</p>
                        <p className="text-sm text-gray-600 mt-1">{review.commentZh}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => handleToggle(prop.id, idx)}
                          className={`px-3 py-1.5 rounded-xl text-xs transition-colors ${
                            hidden
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {hidden ? '✓ 恢復顯示' : '隱藏'}
                        </button>
                        <button
                          onClick={() => handleToggle(prop.id, idx)}
                          className="px-3 py-1.5 rounded-xl text-xs bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                        >
                          檢舉
                        </button>
                      </div>
                    </div>
                    {hidden && (
                      <p className="text-xs text-gray-400 mt-2">⚠️ 此評價已隱藏，不顯示於前台。</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Canned responses tab */}
      {activeTab === 'canned' && (
        <div className="bg-white rounded-2xl shadow-card p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-gray-800">罐頭回覆快捷選項</h2>
            <button onClick={openEditCanned}
              className="px-4 py-2 bg-primary-700 text-white rounded-xl text-sm hover:bg-primary-600 transition-colors">
              編輯
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">中文選項</p>
              <div className="flex flex-wrap gap-2">
                {canned.zh.map((item, i) => (
                  <span key={i} className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm border border-primary-100">
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">English Options</p>
              <div className="flex flex-wrap gap-2">
                {canned.en.map((item, i) => (
                  <span key={i} className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full text-sm border border-primary-100">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-400 mt-4">
            ※ 這些選項會顯示在前台聊天室的快捷回覆按鈕中。
          </p>
        </div>
      )}

      {/* Edit canned modal */}
      {editCanned && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditCanned(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-5">編輯罐頭回覆選項</h3>
            <div className="space-y-5">
              {(['zh', 'en'] as const).map(lang => (
                <div key={lang}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {lang === 'zh' ? '中文選項（每行一個）' : 'English options (one per line)'}
                  </label>
                  <textarea
                    rows={5}
                    value={cannedDraft[lang].join('\n')}
                    onChange={e => setCannedDraft(d => ({ ...d, [lang]: e.target.value.split('\n').filter(Boolean) }))}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300 font-mono"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditCanned(false)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">取消</button>
              <button onClick={saveCanned} className="flex-1 py-2.5 bg-primary-700 text-white rounded-xl hover:bg-primary-600 transition-colors font-medium">儲存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
