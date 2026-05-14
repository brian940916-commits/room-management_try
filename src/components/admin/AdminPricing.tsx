import { useState, useCallback } from 'react';
import type { PricingRule } from '../../types/admin';
import { getAllProperties, getPricingRules, setPricingRule, getPricingHistory } from '../../data/adminStore';

export function AdminPricing() {
  const allProps = getAllProperties().filter(p => p.status === 'active');
  const [rules, setRules] = useState<PricingRule[]>(() => getPricingRules());
  const [history] = useState(() => getPricingHistory().slice(0, 20));
  const [editRule, setEditRule] = useState<PricingRule | null>(null);
  const [selectedPropId, setSelectedPropId] = useState<number | null>(null);

  const refresh = useCallback(() => setRules(getPricingRules()), []);

  function openEdit(propId: number, roomId: number, basePrice: number, baseOriginal: number) {
    const existing = rules.find(r => r.propertyId === propId && r.roomId === roomId);
    setEditRule(existing ?? {
      propertyId: propId, roomId,
      weekdayPrice: basePrice,
      weekendMultiplier: 1.2,
      holidayMultiplier: 1.5,
      earlyBirdDays: 30,
      earlyBirdDiscount: 0.1,
    });
    void baseOriginal;
  }

  function handleSave() {
    if (!editRule) return;
    setPricingRule(editRule);
    setEditRule(null);
    refresh();
  }

  const calcPrice = (base: number, mult: number) => Math.round(base * mult);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">定價與折扣管理</h1>

      {/* Property selector */}
      <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
        <h2 className="font-bold text-gray-800 mb-3">選擇房源</h2>
        <div className="flex flex-wrap gap-2">
          {allProps.map(p => (
            <button key={p.id} onClick={() => setSelectedPropId(p.id)}
              className={`px-3 py-1.5 rounded-xl text-sm border transition-colors ${
                selectedPropId === p.id ? 'bg-primary-700 text-white border-primary-700' : 'border-gray-200 text-gray-600 hover:border-primary-300'
              }`}
            >
              {p.name.zh}
            </button>
          ))}
        </div>
      </div>

      {selectedPropId && (() => {
        const prop = allProps.find(p => p.id === selectedPropId);
        if (!prop) return null;
        return (
          <div className="bg-white rounded-2xl shadow-card p-5 mb-6">
            <h2 className="font-bold text-gray-800 mb-4">{prop.name.zh} — 房型定價</h2>
            <div className="space-y-3">
              {prop.rooms.map(room => {
                const rule = rules.find(r => r.propertyId === prop.id && r.roomId === room.id);
                const base = rule?.weekdayPrice ?? room.price;
                return (
                  <div key={room.id} className="border border-gray-100 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-800">{room.type.zh}</p>
                        <p className="text-xs text-gray-400 mt-0.5">最多 {room.capacity} 人</p>
                      </div>
                      <button onClick={() => openEdit(prop.id, room.id, room.price, room.originalPrice)}
                        className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-xs hover:bg-primary-100 transition-colors">
                        編輯定價
                      </button>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-3 text-sm">
                      <div className="bg-blue-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-blue-500 mb-1">平日</p>
                        <p className="font-bold text-blue-800">NT${base.toLocaleString()}</p>
                      </div>
                      <div className="bg-orange-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-orange-500 mb-1">假日 ×{rule?.weekendMultiplier ?? 1.2}</p>
                        <p className="font-bold text-orange-800">NT${calcPrice(base, rule?.weekendMultiplier ?? 1.2).toLocaleString()}</p>
                      </div>
                      <div className="bg-red-50 rounded-xl p-3 text-center">
                        <p className="text-xs text-red-500 mb-1">國定假日 ×{rule?.holidayMultiplier ?? 1.5}</p>
                        <p className="font-bold text-red-800">NT${calcPrice(base, rule?.holidayMultiplier ?? 1.5).toLocaleString()}</p>
                      </div>
                    </div>
                    {rule && (
                      <p className="text-xs text-gray-400 mt-2">
                        早鳥優惠：提前 {rule.earlyBirdDays} 天訂房享 {Math.round(rule.earlyBirdDiscount * 100)}% 折扣
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* Pricing history */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl shadow-card p-5">
          <h2 className="font-bold text-gray-800 mb-4">定價異動記錄</h2>
          <div className="space-y-2">
            {history.map((h, i) => {
              const prop = allProps.find(p => p.id === h.propertyId);
              return (
                <div key={i} className="flex items-center justify-between text-sm border-b border-gray-50 pb-2 last:border-0">
                  <span className="text-gray-700">{prop?.name.zh ?? `房源 ${h.propertyId}`}</span>
                  <span className="text-gray-500">{h.field}: NT${h.oldValue.toLocaleString()} → NT${h.newValue.toLocaleString()}</span>
                  <span className="text-xs text-gray-400">{new Date(h.changedAt).toLocaleDateString('zh-TW')}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Edit modal */}
      {editRule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setEditRule(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-5">編輯定價規則</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">平日房價（NT$）</label>
                <input type="number" value={editRule.weekdayPrice}
                  onChange={e => setEditRule(r => r ? { ...r, weekdayPrice: parseInt(e.target.value) } : r)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">假日倍率</label>
                  <input type="number" step="0.05" min="1" value={editRule.weekendMultiplier}
                    onChange={e => setEditRule(r => r ? { ...r, weekendMultiplier: parseFloat(e.target.value) } : r)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">國定假日倍率</label>
                  <input type="number" step="0.1" min="1" value={editRule.holidayMultiplier}
                    onChange={e => setEditRule(r => r ? { ...r, holidayMultiplier: parseFloat(e.target.value) } : r)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">早鳥天數（天前訂）</label>
                  <input type="number" min="1" value={editRule.earlyBirdDays}
                    onChange={e => setEditRule(r => r ? { ...r, earlyBirdDays: parseInt(e.target.value) } : r)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">早鳥折扣（0.1 = 9折）</label>
                  <input type="number" step="0.05" min="0" max="0.5" value={editRule.earlyBirdDiscount}
                    onChange={e => setEditRule(r => r ? { ...r, earlyBirdDiscount: parseFloat(e.target.value) } : r)}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
              </div>
              {/* Auto-calculated preview */}
              <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1">
                <p className="text-gray-500 font-medium mb-2">自動計算預覽</p>
                <div className="flex justify-between"><span>平日</span><span className="font-bold">NT${editRule.weekdayPrice.toLocaleString()}</span></div>
                <div className="flex justify-between"><span>假日</span><span className="font-bold">NT${calcPrice(editRule.weekdayPrice, editRule.weekendMultiplier).toLocaleString()}</span></div>
                <div className="flex justify-between"><span>國定假日</span><span className="font-bold">NT${calcPrice(editRule.weekdayPrice, editRule.holidayMultiplier).toLocaleString()}</span></div>
                <div className="flex justify-between text-green-600"><span>早鳥優惠價</span><span className="font-bold">NT${calcPrice(editRule.weekdayPrice, 1 - editRule.earlyBirdDiscount).toLocaleString()}</span></div>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setEditRule(null)} className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">取消</button>
              <button onClick={handleSave} className="flex-1 py-2.5 bg-primary-700 text-white rounded-xl hover:bg-primary-600 transition-colors font-medium">儲存</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
