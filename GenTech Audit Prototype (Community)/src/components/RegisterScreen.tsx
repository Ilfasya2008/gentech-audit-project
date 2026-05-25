import { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Lock, ShieldCheck, ArrowLeft, UserPlus } from 'lucide-react';

export function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validasi Password
    if (formData.password !== formData.confirmPassword) {
      alert("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost/gentech-audit-project/api-gentech/register.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        alert("Pendaftaran Berhasil! Silakan Login.");
        window.location.href = '/';
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error(error);
      alert("Gagal terhubung ke server XAMPP.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-4 rounded-2xl bg-blue-600 mb-4 shadow-lg shadow-blue-200">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Buat Akun Baru</h2>
          <p className="text-gray-500 text-sm mt-1">Daftar untuk mulai belajar audit blockchain</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Nama */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Nama Lengkap</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                required
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition bg-gray-50/50"
                placeholder="Nama Anda"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          {/* Input Email */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                required
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition bg-gray-50/50"
                placeholder="your@email.com"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
          </div>

          {/* Input Password */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition bg-gray-50/50"
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-700 ml-1">Konfirmasi Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                required
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition bg-gray-50/50"
                placeholder="••••••••"
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-3.5 rounded-2xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100 flex items-center justify-center gap-2"
          >
            {isLoading ? "Memproses..." : (
              <>
                <UserPlus className="w-5 h-5" />
                Daftar Sekarang
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-50 text-center">
          <button 
            onClick={() => window.location.href = '/'}
            className="text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2 mx-auto"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Login
          </button>
        </div>
      </motion.div>
    </div>
  );
}