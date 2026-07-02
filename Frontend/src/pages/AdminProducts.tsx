import { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import type { Product } from '../types';
import { formatPrice } from '../utils/format';
import { useToast } from '../hooks/useToast';
import AdminLayout from '../components/AdminLayout';
import Modal from '../components/Modal';
import Button from '../components/Button';
import Input from '../components/Input';
import Spinner from '../components/Spinner';

interface ProductForm {
  name: string;
  description: string;
  price: string;
  stock: string;
}

const emptyForm: ProductForm = { name: '', description: '', price: '', stock: '' };

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { showToast } = useToast();

  const fetchProducts = async () => {
    try {
      const res = await api.get('/products', { params: { page: 1, limit: 100 } });
      setProducts(res.data.data);
    } catch {
      showToast('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setImageFile(null);
    setImagePreview(null);
    setModal('create');
  };

  const openEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      stock: String(product.stock),
    });
    setEditingId(product.productId);
    setImageFile(null);
    setImagePreview(product.imageUrl || null);
    setModal('edit');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.stock) {
      showToast('Name, price, and stock are required', 'error');
      return;
    }
    if (Number(form.price) <= 0) {
      showToast('Price must be greater than zero', 'error');
      return;
    }
    if (Number(form.stock) < 0 || !Number.isInteger(Number(form.stock))) {
      showToast('Stock must be a non-negative integer', 'error');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('name', form.name);
      formData.append('description', form.description);
      formData.append('price', form.price);
      formData.append('stock', form.stock);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      if (modal === 'create') {
        await api.post('/products', formData);
        showToast('Product created', 'success');
      } else {
        await api.put(`/products/${editingId}`, formData);
        showToast('Product updated', 'success');
      }
      setModal(null);
      fetchProducts();
    } catch {
      showToast('Failed to save product', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      showToast('Product deleted', 'success');
      fetchProducts();
    } catch {
      showToast('Failed to delete product', 'error');
    }
  };

  if (loading) return <AdminLayout><Spinner size="lg" /></AdminLayout>;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Products</h1>
        <Button onClick={openCreate}>New Product</Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Image</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Name</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Price</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Stock</th>
                <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.productId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex items-center justify-center">
                      {p.imageUrl ? (
                        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <svg className="w-5 h-5 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-900">{p.name}</td>
                  <td className="px-4 py-3 text-right text-gray-900">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 text-right text-gray-900">{p.stock}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => openEdit(p)} className="text-indigo-600 hover:text-indigo-800 mr-3 transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(p.productId)} className="text-red-600 hover:text-red-800 transition-colors">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal title={modal === 'create' ? 'New Product' : 'Edit Product'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <Input label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Price" type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              <Input label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 file:cursor-pointer"
              />
              {imagePreview && (
                <div className="mt-2 w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={() => setModal(null)} className="flex-1">Cancel</Button>
              <Button onClick={handleSave} loading={saving} className="flex-1">
                {modal === 'create' ? 'Create' : 'Save'}
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </AdminLayout>
  );
}
