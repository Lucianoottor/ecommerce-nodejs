import { useState, useEffect } from 'react';
import api from '../services/api';
import AdminLayout from '../components/AdminLayout';
import { formatPrice } from '../utils/format';
import Spinner from '../components/Spinner';

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalStock: number;
}

export default function Admin() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then((res) => setStats(res.data.data))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLayout><Spinner size="lg" /></AdminLayout>;

  const cards = [
    { label: 'Total Orders', value: stats?.totalOrders ?? 0 },
    { label: 'Revenue', value: formatPrice(stats?.totalRevenue ?? 0) },
    { label: 'Products', value: stats?.totalProducts ?? 0 },
    { label: 'Total Stock', value: stats?.totalStock ?? 0 },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
            <p className="text-sm text-gray-500 mb-1">{card.label}</p>
            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
