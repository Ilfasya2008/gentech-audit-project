import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';

interface Module {
  id: number;
  title: string;
  description: string;
  status: string;
  duration: string; // Tambahkan ini agar sinkron
}

export default function AdminDashboard() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ title: '', duration: '', description: '', status: 'draft' });

  useEffect(() => { fetchModules(); }, []);

  const fetchModules = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/modules');
      setModules(response.data.data);
      setLoading(false);
    } catch (error) { console.error("Gagal ambil data:", error); setLoading(false); }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Yakin ingin menghapus modul ini?")) {
      try {
        await axios.delete(`http://localhost:8000/api/modules/${id}`);
        fetchModules();
      } catch (error) { alert("Gagal menghapus modul"); }
    }
  };

  const handleEdit = (mod: Module) => {
    setEditingId(mod.id);
    setFormData({ title: mod.title, duration: mod.duration, description: mod.description, status: mod.status });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/modules/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:8000/api/modules', formData);
      }
      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ title: '', duration: '', description: '', status: 'draft' });
      fetchModules();
    } catch (error) { alert("Gagal menyimpan data"); }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="bg-white p-8 rounded-xl shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Manajemen Konten Modul</h1>
          <Button onClick={() => { setEditingId(null); setIsModalOpen(true); }} className="bg-[#4D6EFD]">Tambah Modul</Button>
        </div>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b"><th className="pb-3">Judul</th><th className="pb-3">Status</th><th className="pb-3">Aksi</th></tr>
          </thead>
          <tbody>
            {modules.map((mod) => (
              <tr key={mod.id} className="border-b">
                <td className="py-4 font-semibold">{mod.title}</td>
                <td className="py-4"><span className="bg-green-100 px-2 py-1 rounded-full text-xs">{mod.status}</span></td>
                <td className="py-4">
                  <button onClick={() => handleEdit(mod)} className="text-blue-500 mr-3">Edit</button>
                  <button onClick={() => handleDelete(mod.id)} className="text-red-500">Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl w-96 space-y-4">
            <h2 className="font-bold text-lg">{editingId ? 'Edit Modul' : 'Tambah Modul'}</h2>
            <input placeholder="Judul" className="w-full border p-2 rounded" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            <input placeholder="Durasi" className="w-full border p-2 rounded" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
            <textarea placeholder="Deskripsi" className="w-full border p-2 rounded" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setIsModalOpen(false)}>Batal</button>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Simpan</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}