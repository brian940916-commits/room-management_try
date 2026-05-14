import { useState, useCallback } from 'react';
import type { Property, PropertyStatus } from '../../types/property';
import {
  getAllProperties, setPropertyStatus, applyPropertyEdit,
  addProperty, updateNewProperty,
} from '../../data/adminStore';
import { stations } from '../../data/stations';
import { tags } from '../../data/tags';

const STATUS_LABEL: Record<PropertyStatus, { zh: string; color: string }> = {
  active:   { zh: '上架中', color: 'bg-green-100 text-green-700' },
  inactive: { zh: '已下架', color: 'bg-gray-100 text-gray-500' },
  pending:  { zh: '待審核', color: 'bg-amber-100 text-amber-700' },
};

type FormMode = 'add' | 'edit';

interface FormState {
  nameZh: string; nameEn: string;
  station: string; distKm: string;
  descZh: string; descEn: string;
  amenities: string[];
  photos: string;
  checkIn: string; checkOut: string;
  weekdayPrice: string; originalPrice: string;
}

const EMPTY_FORM: FormState = {
  nameZh: '', nameEn: '', station: 'taichung', distKm: '0.5',
  descZh: '', descEn: '', amenities: [], photos: '',
  checkIn: '15:00', checkOut: '11:00',
  weekdayPrice: '2000', originalPrice: '2500',
};

export function AdminProperties() {
  const [properties, setProperties] = useState<Property[]>(() => getAllProperties());
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<PropertyStatus | 'all'>('all');
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>('add');
  const [editTarget, setEditTarget] = useState<Property | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);

  const refresh = useCallback(() => setProperties(getAllProperties()), []);

  function handleStatusChange(id: number, status: PropertyStatus) {
    setPropertyStatus(id, status);
    refresh();
  }

  function openAdd() {
    setFormMode('add');
    setForm(EMPTY_FORM);
    setEditTarget(null);
    setShowForm(true);
  }

  function openEdit(p: Property) {
    setFormMode('edit');
    setEditTarget(p);
    setForm({
      nameZh: p.name.zh, nameEn: p.name.en,
      station: p.station, distKm: String(p.distKm),
      descZh: p.desc.zh, descEn: p.desc.en,
      amenities: [...p.amenities],
      photos: p.photos.join('\n'),
      checkIn: p.policies.checkIn, checkOut: p.policies.checkOut,
      weekdayPrice: String(p.rooms[0]?.price ?? 2000),
      originalPrice: String(p.rooms[0]?.originalPrice ?? 2500),
    });
    setShowForm(true);
  }

  function handleSave() {
    const photos = form.photos.split('\n').map(s => s.trim()).filter(Boolean);
    if (formMode === 'add') {
      addProperty({
        name: { zh: form.nameZh, en: form.nameEn },
        station: form.station,
        distKm: parseFloat(form.distKm) || 0.5,
        rating: 0, reviewCount: 0,
        photos, amenities: form.amenities,
        desc: { zh: form.descZh, en: form.descEn },
        reviews: [],
        rooms: [{
          id: 1,
          type: { zh: '標準雙人房', en: 'Standard Double' },
          capacity: 2,
          price: parseInt(form.weekdayPrice) || 2000,
          originalPrice: parseInt(form.originalPrice) || 2500,
          qty: 3,
        }],
        policies: { checkIn: form.checkIn, checkOut: form.checkOut, maxCapacity: 2 },
      });
    } else if (editTarget) {
      const changes: Partial<Property> = {
        name: { zh: form.nameZh, en: form.nameEn },
        station: form.station,
        distKm: parseFloat(form.distKm) || editTarget.distKm,
        photos, amenities: form.amenities,
        desc: { zh: form.descZh, en: form.descEn },
        policies: { ...editTarget.policies, checkIn: form.checkIn, checkOut: form.checkOut },
      };
      if (editTarget.id >= 1000) updateNewProperty(editTarget.id, changes);
      else applyPropertyEdit(editTarget.id, changes);
    }
    setShowForm(false);
    refresh();
  }

  const visible = properties.filter(p => {
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    if (search && !p.name.zh.includes(search) && !p.name.en.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">房源管理</h1>
        <button onClick={openAdd} className="px-4 py-2 bg-primary-700 text-white rounded-xl hover:bg-primary-600 transition-colors text-sm font-medium">
          + 新增房源
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="搜尋房源名稱…"
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300"
        />
        <div className="flex gap-1">
          {(['all', 'active', 'inactive', 'pending'] as const).map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                statusFilter === s ? 'bg-primary-700 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? '全部' : STATUS_LABEL[s].zh}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['房源名稱', '車站', '距離', '評分', '狀態', '操作'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map(p => {
                const status = p.status ?? 'active';
                const sl = STATUS_LABEL[status];
                const st = stations.find(s => s.id === p.station);
                return (
                  <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{p.name.zh}</td>
                    <td className="px-4 py-3 text-gray-600">{st?.zh ?? p.station}</td>
                    <td className="px-4 py-3 text-gray-600">{p.distKm} km</td>
                    <td className="px-4 py-3 text-gray-600">
                      {p.rating > 0 ? `⭐ ${p.rating}` : '—'}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${sl.color}`}>
                        {sl.zh}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(p)} className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs hover:bg-gray-200 transition-colors">
                          編輯
                        </button>
                        {status === 'pending' && (
                          <button onClick={() => handleStatusChange(p.id, 'active')} className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs hover:bg-green-200 transition-colors">
                            審核通過
                          </button>
                        )}
                        {status === 'active' && (
                          <button onClick={() => handleStatusChange(p.id, 'inactive')} className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs hover:bg-gray-200 transition-colors">
                            下架
                          </button>
                        )}
                        {status === 'inactive' && (
                          <button onClick={() => handleStatusChange(p.id, 'active')} className="px-2.5 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs hover:bg-blue-200 transition-colors">
                            上架
                          </button>
                        )}
                        {status === 'pending' && (
                          <button onClick={() => handleStatusChange(p.id, 'inactive')} className="px-2.5 py-1 bg-red-100 text-red-600 rounded-lg text-xs hover:bg-red-200 transition-colors">
                            退件
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {visible.length === 0 && (
                <tr><td colSpan={6} className="py-12 text-center text-gray-400">沒有符合的房源</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowForm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-5">
              {formMode === 'add' ? '新增房源' : '編輯房源'}
            </h2>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">名稱（中文）*</label>
                  <input value={form.nameZh} onChange={e => setForm(f => ({ ...f, nameZh: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Name (English) *</label>
                  <input value={form.nameEn} onChange={e => setForm(f => ({ ...f, nameEn: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">車站</label>
                  <select value={form.station} onChange={e => setForm(f => ({ ...f, station: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300">
                    {stations.map(s => <option key={s.id} value={s.id}>{s.zh}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">距車站（km）</label>
                  <input type="number" step="0.1" min="0" value={form.distKm}
                    onChange={e => setForm(f => ({ ...f, distKm: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">介紹（中文）</label>
                <textarea value={form.descZh} rows={2} onChange={e => setForm(f => ({ ...f, descZh: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Description (English)</label>
                <textarea value={form.descEn} rows={2} onChange={e => setForm(f => ({ ...f, descEn: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-2">設施（多選）</label>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <label key={tag.code} className="flex items-center gap-1.5 cursor-pointer">
                      <input type="checkbox" checked={form.amenities.includes(tag.code)}
                        onChange={() => setForm(f => ({
                          ...f,
                          amenities: f.amenities.includes(tag.code)
                            ? f.amenities.filter(c => c !== tag.code)
                            : [...f.amenities, tag.code],
                        }))}
                        className="accent-primary-700" />
                      <span className="text-sm text-gray-700">{tag.icon} {tag.zh}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">照片網址（每行一個）</label>
                <textarea value={form.photos} rows={3} onChange={e => setForm(f => ({ ...f, photos: e.target.value }))}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary-300" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">入住時間</label>
                  <input type="time" value={form.checkIn} onChange={e => setForm(f => ({ ...f, checkIn: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">退房時間</label>
                  <input type="time" value={form.checkOut} onChange={e => setForm(f => ({ ...f, checkOut: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                </div>
              </div>

              {formMode === 'add' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">起始房價（NT$）</label>
                    <input type="number" value={form.weekdayPrice} onChange={e => setForm(f => ({ ...f, weekdayPrice: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">原價（NT$）</label>
                    <input type="number" value={form.originalPrice} onChange={e => setForm(f => ({ ...f, originalPrice: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
                  </div>
                </div>
              )}

              {formMode === 'add' && (
                <div className="bg-amber-50 rounded-xl p-3 text-xs text-amber-700">
                  ⚠️ 新增房源將進入「待審核」狀態，需在房源列表中審核通過後才會上架。
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowForm(false)} className="px-4 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                取消
              </button>
              <button
                onClick={handleSave}
                disabled={!form.nameZh}
                className="flex-1 py-2.5 bg-primary-700 text-white rounded-xl hover:bg-primary-600 disabled:opacity-40 transition-colors font-medium"
              >
                {formMode === 'add' ? '提交審核' : '儲存修改'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
