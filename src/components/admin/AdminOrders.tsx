import { useState, useCallback } from 'react';
import type { Booking } from '../../types/property';
import { getAllBookings, updateBookingStatus, detectOverlap, isCompensationSent, markCompensationSent } from '../../data/adminStore';

const STATUS_LABEL: Record<Booking['status'], { zh: string; color: string }> = {
  confirmed: { zh: '已確認', color: 'bg-green-100 text-green-700' },
  pending:   { zh: '待確認', color: 'bg-yellow-100 text-yellow-700' },
  cancelled: { zh: '已取消', color: 'bg-red-100 text-red-600' },
};

export function AdminOrders() {
  const [bookings, setBookings] = useState<Booking[]>(() => getAllBookings());
  const [statusFilter, setStatusFilter] = useState<Booking['status'] | 'all'>('all');
  const [search, setSearch] = useState('');
  const [compensationModal, setCompensationModal] = useState<{ booking: Booking; conflictWith: Booking } | null>(null);
  const [compensationSent, setCompensationSent] = useState(false);

  const refresh = useCallback(() => setBookings(getAllBookings()), []);

  const conflicts = detectOverlap(bookings);

  function handleStatusChange(id: string, status: Booking['status']) {
    updateBookingStatus(id, status);
    refresh();
  }

  function sendCompensation(bookingId: string, amount: number) {
    markCompensationSent(bookingId, amount);
    setCompensationSent(true);
  }

  const visible = bookings.filter(b => {
    if (statusFilter !== 'all' && b.status !== statusFilter) return false;
    if (search && !b.guestName.includes(search) && !b.id.includes(search.toUpperCase())) return false;
    return true;
  });

  const conflictIds = new Set(conflicts.flatMap(c => [c.a.id, c.b.id]));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">訂單管理</h1>

      {/* Overlap alerts */}
      {conflicts.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
          <p className="font-medium text-red-800 mb-2">⚠️ 偵測到 {conflicts.length} 組訂單日期重疊</p>
          <div className="space-y-2">
            {conflicts.map((c, i) => {
              const sentB = isCompensationSent(c.b.id);
              return (
                <div key={i} className="bg-white rounded-xl p-3 flex flex-wrap items-center gap-2 text-sm">
                  <span className="font-mono text-xs text-gray-500">{c.a.id}</span>
                  <span className="text-gray-400">↔</span>
                  <span className="font-mono text-xs text-gray-500">{c.b.id}</span>
                  <span className="text-gray-500">|</span>
                  <span className="text-gray-700">{c.a.cartItems[0]?.propertyName.zh}</span>
                  {!sentB && (
                    <button
                      onClick={() => { setCompensationModal({ booking: c.b, conflictWith: c.a }); setCompensationSent(false); }}
                      className="ml-auto px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-colors"
                    >
                      發送補貼通知 →
                    </button>
                  )}
                  {sentB && <span className="ml-auto text-xs text-green-600">✓ 補貼已發送</span>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="搜尋旅客姓名或訂單編號…"
          className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-300" />
        <div className="flex gap-1">
          {(['all', 'confirmed', 'pending', 'cancelled'] as const).map(s => (
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
        {visible.length === 0 ? (
          <p className="text-center py-16 text-gray-400">尚無訂單</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['訂單編號', '旅客', '房源', '入住日期', '金額', '特殊需求', '狀態', '操作'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-gray-500 font-medium whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visible.map(b => {
                  const sl = STATUS_LABEL[b.status];
                  const isConflict = conflictIds.has(b.id);
                  return (
                    <tr key={b.id} className={`border-b border-gray-50 hover:bg-gray-50 transition-colors ${isConflict ? 'bg-red-50/30' : ''}`}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs text-gray-500">{b.id}</span>
                          {isConflict && <span className="text-red-500 text-xs">⚠️</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-800">{b.guestName}</td>
                      <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">
                        {b.cartItems.map(i => i.propertyName.zh).join('、')}
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {b.cartItems[0]?.checkIn ?? '—'}
                      </td>
                      <td className="px-4 py-3 font-medium text-primary-700">NT${b.totalAmount.toLocaleString()}</td>
                      <td className="px-4 py-3 text-gray-500 text-xs max-w-[100px] truncate">
                        {b.specialRequests || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${sl.color}`}>
                          {sl.zh}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5">
                          {b.status === 'pending' && (
                            <button onClick={() => handleStatusChange(b.id, 'confirmed')}
                              className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs hover:bg-green-200 transition-colors">
                              確認
                            </button>
                          )}
                          {b.status === 'confirmed' && (
                            <button onClick={() => handleStatusChange(b.id, 'cancelled')}
                              className="px-2.5 py-1 bg-red-100 text-red-600 rounded-lg text-xs hover:bg-red-200 transition-colors">
                              取消
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Compensation modal */}
      {compensationModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setCompensationModal(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            {!compensationSent ? (
              <>
                <h3 className="text-lg font-bold text-gray-900 mb-2">發送補貼通知</h3>
                <p className="text-sm text-gray-500 mb-5">以下通知將模擬發送給後訂的旅客。</p>

                <div className="bg-gray-50 rounded-2xl p-4 mb-5 text-sm space-y-2">
                  <p className="font-medium text-gray-800">收件人：{compensationModal.booking.guestName}</p>
                  <p className="text-gray-600">信箱：{compensationModal.booking.email}</p>
                  <hr className="border-gray-200" />
                  <p className="text-gray-700 leading-relaxed">
                    親愛的 {compensationModal.booking.guestName} 旅客，您好。<br /><br />
                    很抱歉通知您，您預訂的
                    <strong>「{compensationModal.booking.cartItems[0]?.propertyName.zh}」</strong>
                    （{compensationModal.booking.cartItems[0]?.checkIn} ~ {compensationModal.booking.cartItems[0]?.checkOut}）
                    因訂房日期與其他訂單重疊，我們將為您提供
                    <strong className="text-accent-600"> NT${Math.round(compensationModal.booking.totalAmount * 0.2).toLocaleString()} </strong>
                    的補貼作為歉意，並協助您安排替代住宿。
                  </p>
                  <p className="text-gray-500 text-xs mt-2">補貼金額：訂單金額 20%</p>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setCompensationModal(null)}
                    className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors">
                    取消
                  </button>
                  <button
                    onClick={() => sendCompensation(compensationModal.booking.id, Math.round(compensationModal.booking.totalAmount * 0.2))}
                    className="flex-1 py-2.5 bg-accent-500 text-white rounded-xl hover:bg-accent-600 transition-colors font-medium">
                    確認發送
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center py-4">
                <div className="text-5xl mb-3">✅</div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">補貼通知已發送</h3>
                <p className="text-sm text-gray-500 mb-5">模擬通知已送出，補貼 NT${Math.round(compensationModal.booking.totalAmount * 0.2).toLocaleString()} 已記錄。</p>
                <button onClick={() => setCompensationModal(null)}
                  className="px-6 py-2.5 bg-primary-700 text-white rounded-xl hover:bg-primary-600 transition-colors">
                  關閉
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
