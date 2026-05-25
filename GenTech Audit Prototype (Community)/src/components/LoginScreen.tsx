import { useState } from 'react';
import { Lock, Mail } from 'lucide-react';
import logo from 'figma:asset/3b670beca6d9f65f8127efd31decabb8aaae9980.png';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Panggil API PHP yang ada di XAMPP
      const response = await fetch('http://localhost/gentech-audit-project/api-gentech/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        alert(`Selamat datang, ${data.name}!`);
        
        // LOGIKA PEMBEDA ADMIN DAN USER
        if (data.role === 'admin') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/welcome'; // Arahkan user biasa ke proses onboarding
        }
        
      } else {
        // Kalau password atau email salah, munculin error dari database
        alert(data.message);
      }
    } catch (error) {
      console.error("Error connecting to server:", error);
      alert("Gagal terhubung ke database. Pastikan XAMPP Apache & MySQL menyala.");
      
      // HAPUS ATAU COMMENT 2 BARIS DI BAWAH JIKA BACKEND SUDAH JALAN 100%
      // Ini hanya fallback darurat agar kamu tetap bisa masuk jika API belum siap
      console.log("Fallback mode aktif...");
      onLogin(); 
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-blue-50 to-white overflow-y-auto">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <img src={logo} alt="GenTech Audit" className="w-28 h-28" />
          </div>
          <h1 className="text-primary mb-2">GenTech Audit</h1>
          <p className="text-muted-foreground">Blockchain Audit Learning</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-primary mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition bg-white"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-primary mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition bg-white"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3.5 rounded-2xl hover:bg-blue-800 transition shadow-lg hover:shadow-xl"
          >
            Masuk
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground">
            Belum punya akun?{' '}
            <button 
              type="button"
              onClick={() => window.location.href='/register'}
              className="text-primary hover:text-blue-800 font-bold transition-colors"
            >
              Daftar Sekarang
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}