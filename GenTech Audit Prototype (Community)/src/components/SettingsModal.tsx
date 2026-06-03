import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, User, Lock, Database, Save, RotateCcw, AlertTriangle, CheckCircle2, XCircle, HelpCircle, ChevronDown, ChevronUp, ShieldAlert } from 'lucide-react';
import { getCurrentUserEmail, getCurrentUserName, setCurrentUserName, setCurrentUserEmail, resetUserProgress, getCurrentUserRole } from '../lib/userProgress';
import axios from 'axios';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'profile' | 'security' | 'data' | 'faq';

interface Faq {
  id: number;
  question: string;
  answer: string;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  
  // Profile State
  const [name, setName] = useState(getCurrentUserName() || '');
  const [email, setEmail] = useState(getCurrentUserEmail() || '');
  const [profileSaved, setProfileSaved] = useState(false);

  // Security State
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // FAQ State
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(false);
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);

  useEffect(() => {
    if (activeTab === 'faq' && faqs.length === 0) {
      setLoadingFaqs(true);
      axios.get('http://localhost:8000/api/faqs')
        .then(res => {
          if (res.data.success) {
            setFaqs(res.data.data);
          }
        })
        .catch(err => console.error("Error fetching FAQs:", err))
        .finally(() => setLoadingFaqs(false));
    }
  }, [activeTab, faqs.length]);



  useEffect(() => {
    if (isOpen) {
      setName(getCurrentUserName() || '');
      setEmail(getCurrentUserEmail() || '');
      setProfileSaved(false);
      setPasswordSaved(false);
      setPasswordError('');
      setOldPassword('');
      setNewPassword('');
    }
  }, [isOpen]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8000/api/change-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          name: name,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setCurrentUserName(name);
        setProfileSaved(true);
        setTimeout(() => setProfileSaved(false), 3000);
      } else {
        alert(data.message || 'Gagal menyimpan profil.');
      }
    } catch (error) {
      alert('Gagal terhubung ke server.');
    }
  };

  const handleSavePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setIsChangingPassword(true);
    
    try {
      const response = await fetch('http://localhost:8000/api/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: getCurrentUserEmail(),
          old_password: oldPassword,
          new_password: newPassword,
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        setPasswordSaved(true);
        setTimeout(() => {
          setPasswordSaved(false);
          setOldPassword('');
          setNewPassword('');
        }, 3000);
      } else {
        setPasswordError(data.message || 'Password lama tidak cocok!');
      }
    } catch (error) {
      setPasswordError('Gagal terhubung ke server. Pastikan backend menyala.');
    } finally {
      setIsChangingPassword(false);
    }
  };



  const handleResetProgress = () => {
    if (window.confirm("PERINGATAN: Semua riwayat XP, Lencana, dan Modul Anda akan dihapus. Anda yakin ingin mereset progress?")) {
      resetUserProgress();
      window.location.reload();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", bounce: 0.3 }}
            className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[85vh] md:h-[600px] border border-slate-200 dark:border-slate-800"
          >
            {/* Sidebar Tabs */}
            <div className="w-full md:w-64 bg-slate-50 dark:bg-slate-950 p-6 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 flex-shrink-0 overflow-x-auto md:overflow-visible flex md:flex-col gap-2">
              <div className="hidden md:block mb-8">
                <h2 className="text-xl font-black text-slate-800 dark:text-white flex items-center gap-2">
                  Pengaturan
                </h2>
                <p className="text-sm text-slate-500 mt-1">Kelola preferensi akun Anda</p>
              </div>

              <TabButton 
                active={activeTab === 'profile'} 
                onClick={() => setActiveTab('profile')} 
                icon={User} 
                label="Profil" 
              />
              <TabButton 
                active={activeTab === 'security'} 
                onClick={() => setActiveTab('security')} 
                icon={Lock} 
                label="Keamanan" 
              />
              <TabButton 
                active={activeTab === 'faq'} 
                onClick={() => setActiveTab('faq')} 
                icon={HelpCircle} 
                label="Pusat Bantuan (FAQ)" 
              />
              <TabButton 
                active={activeTab === 'data'} 
                onClick={() => setActiveTab('data')} 
                icon={Database} 
                label="Manajemen Data" 
              />
              
              {getCurrentUserRole() === 'admin' && (
                <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-800">
                  <button
                    onClick={() => window.location.href = '/admin/dashboard'}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold whitespace-nowrap text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30"
                  >
                    <ShieldAlert className="w-5 h-5" />
                    <span className="hidden md:inline">Kembali ke Admin</span>
                  </button>
                </div>
              )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 p-6 md:p-10 overflow-y-auto bg-white dark:bg-slate-900">
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <AnimatePresence mode="wait">
                {activeTab === 'profile' && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Profil Pengguna</h3>
                    <form onSubmit={handleSaveProfile} className="space-y-5 max-w-md">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nama Lengkap</label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                        <input
                          type="email"
                          value={email}
                          readOnly
                          className="w-full px-4 py-3 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-500 dark:text-slate-400 cursor-not-allowed outline-none"
                        />
                      </div>
                      <button
                        type="submit"
                        className="flex items-center justify-center gap-2 w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl transition-all active:scale-95"
                      >
                        <Save className="w-4 h-4" />
                        {profileSaved ? 'Tersimpan!' : 'Simpan Profil'}
                      </button>
                    </form>
                  </motion.div>
                )}

                {activeTab === 'security' && (
                  <motion.div
                    key="security"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Keamanan Akun</h3>
                    
                    {passwordSaved && (
                      <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-5">
                        <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium text-sm">Password berhasil diubah!</span>
                      </div>
                    )}
                    
                    {passwordError && (
                      <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-5">
                        <XCircle className="w-5 h-5 flex-shrink-0" />
                        <span className="font-medium text-sm">{passwordError}</span>
                      </div>
                    )}

                    <form onSubmit={handleSavePassword} className="space-y-5 max-w-md">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password Saat Ini</label>
                        <input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => { setOldPassword(e.target.value); setPasswordError(''); }}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          placeholder="Masukkan password saat ini"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Password Baru</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                          placeholder="Masukkan password baru (min. 6 karakter)"
                          minLength={6}
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="flex items-center justify-center gap-2 w-full md:w-auto bg-slate-900 dark:bg-slate-700 hover:bg-slate-800 dark:hover:bg-slate-600 text-white font-bold py-3 px-8 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Lock className="w-4 h-4" />
                        {isChangingPassword ? 'Memeriksa...' : 'Ubah Password'}
                      </button>
                    </form>
                  </motion.div>
                )}


                {activeTab === 'data' && (
                  <motion.div
                    key="data"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Manajemen Data</h3>
                    
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/50 p-6 rounded-2xl">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/50 rounded-xl flex-shrink-0 text-red-600 dark:text-red-400">
                          <AlertTriangle className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-red-800 dark:text-red-400 text-lg">Reset Progress Belajar</h4>
                          <p className="text-sm text-red-600 dark:text-red-300 mt-1 mb-5 leading-relaxed">
                            Peringatan: Tindakan ini akan secara permanen menghapus semua poin XP, Lencana yang didapat, dan riwayat penyelesaian Modul serta Kuis Anda. Anda akan memulai simulasi dari awal.
                          </p>
                          <button
                            onClick={handleResetProgress}
                            className="flex items-center justify-center gap-2 w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-all active:scale-95"
                          >
                            <RotateCcw className="w-4 h-4" />
                            Ya, Reset Progress Saya
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'faq' && (
                  <motion.div
                    key="faq"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Pusat Bantuan (FAQ)</h3>
                    <p className="text-slate-500 mb-6">Pertanyaan yang sering diajukan seputar platform simulasi GenTech Audit.</p>
                    
                    {loadingFaqs ? (
                      <div className="text-center py-8 text-slate-500">Memuat pertanyaan...</div>
                    ) : faqs.length === 0 ? (
                      <div className="text-center py-8 text-slate-500 bg-slate-50 rounded-xl border border-slate-100">Belum ada FAQ yang tersedia saat ini.</div>
                    ) : (
                      <div className="space-y-3">
                        {faqs.map(faq => (
                          <div key={faq.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm hover:border-blue-200 transition-colors">
                            <button 
                              onClick={() => setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)}
                              className="w-full flex items-center justify-between p-4 text-left font-bold text-slate-700 focus:outline-none"
                            >
                              <span className="pr-4">{faq.question}</span>
                              {expandedFaqId === faq.id ? (
                                <ChevronUp className="w-5 h-5 text-blue-500 flex-shrink-0" />
                              ) : (
                                <ChevronDown className="w-5 h-5 text-slate-400 flex-shrink-0" />
                              )}
                            </button>
                            <AnimatePresence>
                              {expandedFaqId === faq.id && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <div className="px-4 pb-4 text-slate-600 border-t border-slate-100 pt-3 bg-slate-50 leading-relaxed whitespace-pre-wrap">
                                    {faq.answer}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// Subcomponent for Sidebar Tabs
function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold whitespace-nowrap ${
        active 
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800'
      }`}
    >
      <Icon className={`w-5 h-5 ${active ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400'}`} />
      <span className="hidden md:inline">{label}</span>
      <span className="md:hidden">{label}</span>
    </button>
  );
}
