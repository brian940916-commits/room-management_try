import { getAllProperties, getAllBookings, getPricingRules } from '../../data/adminStore';

export function AdminDashboard() {
  const allProps = getAllProperties();
  const bookings = getAllBookings();
  const pricingRules = getPricingRules();

  const activeProps   = allProps.filter(p => p.status === 'active').length;
  const pendingProps  = allProps.filter(p => p.status === 'pending').length;
  const confirmedOrders = bookings.filter(b => b.status === 'confirmed').length;
  const monthRevenue  = bookings
    .filter(b => b.status === 'confirmed' && new Date(b.createdAt).getMonth() === new Date().getMonth())
    .reduce((s, b) => s + b.totalAmount, 0);
  const avgRating     = allProps.length
    ? (allProps.reduce((s, p) => s + p.rating, 0) / allProps.length).toFixed(1)
    : '—';

  const stats = [
    { icon: '🏨', label: '上架房源', value: activeProps, sub: `共 ${allProps.length} 筆`, color: 'bg-blue-50 text-blue-700' },
    { icon: '⏳', label: '待審核房源', value: pendingProps, sub: pendingProps > 0 ? '需要處理' : '無待審核', color: pendingProps > 0 ? 'bg-amber-50 text-amber-700' : 'bg-gray-50 text-gray-500' },
    { icon: '📋', label: '進行中訂單', value: confirmedOrders, sub: `共 ${bookings.length} 筆`, color: 'bg-green-50 text-green-700' },
    { icon: '💰', label: '本月營收', value: `NT$${monthRevenue.toLocaleString()}`, sub: '已確認訂單', color: 'bg-purple-50 text-purple-700' },
    { icon: '⭐', label: '平均評分', value: avgRating, sub: '全部房源', color: 'bg-yellow-50 text-yellow-700' },
    { icon: '📐', label: '定價規則', value: pricingRules.length, sub: '已設定', color: 'bg-indigo-50 text-indigo-700' },
  ];

  const recentBookings = bookings.slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">儀表板</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className={`rounded-2xl p-5 ${s.color}`}>
            <div className="text-2xl mb-2">{s.icon}</div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm font-medium mt-0.5">{s.label}</div>
            <div className="text-xs opacity-70 mt-1">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {pendingProps > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-center gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <p className="font-medium text-amber-800">有 {pendingProps} 筆房源待審核</p>
            <p className="text-sm text-amber-600">請前往「房源管理」審核並決定是否上架。</p>
          </div>
        </div>
      )}

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl shadow-card p-5">
        <h2 className="font-bold text-gray-800 mb-4">最新訂單</h2>
        {recentBookings.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-6">尚無訂單</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-2 text-gray-500 font-medium">訂單編號</th>
                  <th className="text-left py-2 text-gray-500 font-medium">旅客</th>
                  <th className="text-left py-2 text-gray-500 font-medium">金額</th>
                  <th className="text-left py-2 text-gray-500 font-medium">狀態</th>
                  <th className="text-left py-2 text-gray-500 font-medium">日期</th>
                </tr>
              </thead>
              <tbody>
                {recentBookings.map(b => (
                  <tr key={b.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 font-mono text-xs text-gray-500">{b.id}</td>
                    <td className="py-2.5 text-gray-800">{b.guestName}</td>
                    <td className="py-2.5 font-medium text-primary-700">NT${b.totalAmount.toLocaleString()}</td>
                    <td className="py-2.5">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        b.status === 'confirmed' ? 'bg-green-100 text-green-700'
                        : b.status === 'cancelled' ? 'bg-red-100 text-red-600'
                        : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {b.status === 'confirmed' ? '已確認' : b.status === 'cancelled' ? '已取消' : '待確認'}
                      </span>
                    </td>
                    <td className="py-2.5 text-gray-500 text-xs">
                      {new Date(b.createdAt).toLocaleDateString('zh-TW')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
