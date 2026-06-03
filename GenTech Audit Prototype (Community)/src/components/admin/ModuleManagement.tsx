import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  BookOpen, 
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Loader2
} from 'lucide-react';
import AdminLayout from './AdminLayout';
import { Button } from '../ui/button';

interface ContentPage {
  heading: string;
  text: string;
}

interface Module {
  id: number;
  title: string;
  description: string;
  duration: string;
  status: 'draft' | 'published';
  topics?: string[];
  content?: ContentPage[];
}

export default function ModuleManagement() {
  const [modules, setModules] = useState<Module[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState<{
    title: string;
    duration: string;
    description: string;
    status: 'draft' | 'published';
    topics: string;
    content: ContentPage[];
  }>({
    title: '',
    duration: '',
    description: '',
    status: 'draft',
    topics: '',
    content: [{ heading: 'Pengantar', text: '' }]
  });
  
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/api/modules');
      if (response.data.success) {
        // Backend returns raw string if not casted, handle parsed JSON
        const parsedModules = response.data.data.map((mod: any) => ({
          ...mod,
          topics: typeof mod.topics === 'string' ? JSON.parse(mod.topics) : (Array.isArray(mod.topics) ? mod.topics : []),
          content: typeof mod.content === 'string' ? JSON.parse(mod.content) : (Array.isArray(mod.content) ? mod.content : [])
        }));
        setModules(parsedModules);
      }
    } catch (error) {
      console.error("Error fetching modules:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenAddModal = () => {
    setEditingId(null);
    setFormData({ 
      title: '', 
      duration: '', 
      description: '', 
      status: 'draft',
      topics: '',
      content: [{ heading: 'Pengantar', text: '' }]
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (mod: Module) => {
    setEditingId(mod.id);
    const modContent = Array.isArray(mod.content) && mod.content.length > 0 
      ? mod.content 
      : [{ heading: 'Pengantar', text: mod.description || '' }];
      
    setFormData({ 
      title: mod.title, 
      duration: mod.duration || '', 
      description: mod.description, 
      status: mod.status,
      topics: Array.isArray(mod.topics) ? mod.topics.join(', ') : '',
      content: modContent
    });
    setErrorMsg('');
    setIsModalOpen(true);
  };

  const handleDeleteModule = async (id: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus modul ini?")) {
      try {
        const res = await axios.delete(`http://localhost:8000/api/modules/${id}`);
        if (res.data.success) {
          fetchModules();
        }
      } catch (error: any) {
        alert(error.response?.data?.message || "Gagal menghapus modul.");
      }
    }
  };

  const handleContentChange = (index: number, field: keyof ContentPage, value: string) => {
    const newContent = [...formData.content];
    newContent[index] = { ...newContent[index], [field]: value };
    setFormData({ ...formData, content: newContent });
  };

  const addContentPage = () => {
    setFormData({
      ...formData,
      content: [...formData.content, { heading: 'Topik Baru', text: '' }]
    });
  };

  const removeContentPage = (index: number) => {
    if (formData.content.length <= 1) return;
    const newContent = formData.content.filter((_, i) => i !== index);
    setFormData({ ...formData, content: newContent });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title || !formData.description) {
      setErrorMsg("Judul dan Deskripsi wajib diisi");
      return;
    }

    const dataToSubmit = {
      ...formData,
      topics: formData.topics.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
      if (editingId) {
        await axios.put(`http://localhost:8000/api/modules/${editingId}`, dataToSubmit);
      } else {
        await axios.post('http://localhost:8000/api/modules', dataToSubmit);
      }
      setIsModalOpen(false);
      fetchModules();
    } catch (error: any) {
      console.error(error);
      setErrorMsg(error.response?.data?.message || "Terjadi kesalahan saat menyimpan data.");
    }
  };

  const filteredModules = modules.filter(mod => 
    mod.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    mod.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Manajemen Modul Pembelajaran">
      {/* Search & Add Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400" />
          <input
            type="text"
            placeholder="Cari judul atau konten modul..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border-2 border-slate-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none text-sm transition"
          />
        </div>
        <Button 
          onClick={handleOpenAddModal} 
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 py-2.5 flex items-center gap-2 shadow-lg shadow-blue-500/20 font-semibold text-sm h-11"
        >
          <Plus className="w-4.5 h-4.5" />
          Tambah Modul Baru
        </Button>
      </div>

      {/* Modules Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-12 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <p className="text-sm text-slate-500">Memuat data modul...</p>
          </div>
        ) : filteredModules.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-400 text-sm">Tidak ada modul ditemukan.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/75 border-b border-slate-100">
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500">Modul</th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500">Durasi</th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                  <th className="px-6 py-4.5 text-xs font-bold uppercase tracking-wider text-slate-500 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredModules.map((mod) => (
                  <tr key={mod.id} className="hover:bg-slate-50/50 transition duration-150">
                    <td className="px-6 py-4 max-w-md">
                      <div className="flex items-start space-x-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 leading-snug">{mod.title}</p>
                          <p className="text-slate-500 text-xs mt-1 line-clamp-2">{mod.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {mod.duration || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {mod.status === 'published' ? (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold border border-green-100">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-100">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Draft
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEditModal(mod)} 
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Edit Modul"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteModule(mod.id)} 
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Hapus Modul"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-lg text-slate-800">
                {editingId ? 'Edit Modul Pembelajaran' : 'Tambah Modul Baru'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {errorMsg && (
                <div className="bg-red-50 text-red-600 border border-red-100 text-sm px-4 py-3 rounded-xl">
                  {errorMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Judul Modul</label>
                <input 
                  type="text"
                  placeholder="Contoh: Pengenalan Smart Contract Security" 
                  className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white" 
                  value={formData.title} 
                  onChange={e => setFormData({...formData, title: e.target.value})} 
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Durasi</label>
                  <input 
                    type="text"
                    placeholder="Contoh: 15 menit" 
                    className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white" 
                    value={formData.duration} 
                    onChange={e => setFormData({...formData, duration: e.target.value})} 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status Publikasi</label>
                  <select 
                    className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white"
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value as 'draft' | 'published'})}
                  >
                    <option value="draft">Draft (Disembunyikan)</option>
                    <option value="published">Published (Aktif)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kata Kunci / Topik (Pisahkan dengan koma)</label>
                <input 
                  type="text"
                  placeholder="Contoh: Desentralisasi, EVM, Smart Contract" 
                  className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white" 
                  value={formData.topics} 
                  onChange={e => setFormData({...formData, topics: e.target.value})} 
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Deskripsi Singkat (Untuk List)</label>
                <textarea 
                  placeholder="Tulis ringkasan isi modul untuk ditampilkan di menu depan..." 
                  rows={2}
                  className="w-full border-2 border-slate-100 focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-slate-50/50 focus:bg-white resize-none" 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  required
                />
              </div>

              {/* Dynamic Pages Section */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider">Halaman Modul (Konten Utama)</label>
                  <Button type="button" onClick={addContentPage} className="h-8 text-xs flex items-center gap-1 bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold px-3 py-1 rounded-lg">
                    <Plus className="w-3 h-3" /> Tambah Topik
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {formData.content.map((page, index) => (
                    <div key={index} className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 relative">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full border border-blue-200">Topik {index + 1} dari {formData.content.length}</span>
                        {formData.content.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => removeContentPage(index)} 
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      
                      <input 
                        type="text"
                        placeholder="Judul Halaman (contoh: Apa itu Blockchain?)"
                        className="w-full border-2 border-white focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-white shadow-sm mb-3 font-semibold text-slate-800"
                        value={page.heading}
                        onChange={(e) => handleContentChange(index, 'heading', e.target.value)}
                        required
                      />
                      
                      <textarea 
                        placeholder="Tulis materi pembelajaran secara lengkap untuk topik ini..." 
                        rows={5}
                        className="w-full border-2 border-white focus:border-blue-500 outline-none p-3 rounded-xl text-sm transition bg-white shadow-sm resize-none text-slate-600" 
                        value={page.text} 
                        onChange={(e) => handleContentChange(index, 'text', e.target.value)} 
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex justify-end gap-3 pt-6 mt-4 border-t border-slate-100 sticky bottom-0 bg-white pb-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 text-slate-500 px-5"
                >
                  Batal
                </Button>
                <Button 
                  type="submit" 
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6"
                >
                  Simpan Perubahan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
