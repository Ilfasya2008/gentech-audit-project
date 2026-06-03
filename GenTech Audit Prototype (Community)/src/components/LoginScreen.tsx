import { useState, useEffect } from 'react';
import { Lock, Mail, ArrowRight, X, KeyRound, CheckCircle2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import logo from 'figma:asset/3b670beca6d9f65f8127efd31decabb8aaae9980.png';
import { setCurrentUserEmail, setCurrentUserName, setCurrentUserRole } from '../lib/userProgress';

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  // Modal State untuk Lupa Password
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetSent, setIsResetSent] = useState(false);
  const [isEmailNotFound, setIsEmailNotFound] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [cooldown, setCooldown] = useState(() => {
    const savedExpiry = localStorage.getItem('reset_cooldown_expiry');
    if (savedExpiry) {
      const remaining = Math.ceil((parseInt(savedExpiry, 10) - Date.now()) / 1000);
      return remaining > 0 ? remaining : 0;
    }
    return 0;
  });

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown(prev => prev - 1);
      }, 1000);
    } else if (cooldown <= 0) {
      localStorage.removeItem('reset_cooldown_expiry');
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Panggil API Laravel yang ada
      const response = await fetch('http://localhost:8000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.status === 'success') {
        // Save the logged-in user email so progress is stored per-user
        setCurrentUserEmail(data.email);
        if (data.name) {
          setCurrentUserName(data.name);
        }
        setCurrentUserRole(data.role || 'user');
        
        // LOGIKA PEMBEDA ADMIN DAN USER
        if (data.role === 'admin') {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/welcome'; // Arahkan user biasa ke proses onboarding
        }
        
      } else {
        // Kalau password atau email salah, munculin error dari database
        setLoginError(data.message || 'Email atau Password salah!');
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error connecting to server:", error);
      setLoginError("Gagal terhubung ke database. Pastikan XAMPP Apache & MySQL menyala.");
      
      // HAPUS ATAU COMMENT 2 BARIS DI BAWAH JIKA BACKEND SUDAH JALAN 100%
      // Ini hanya fallback darurat agar kamu tetap bisa masuk jika API belum siap
      console.log("Fallback mode aktif...");
      onLogin(); 
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex w-full bg-slate-50">
      
      {/* Left Pane - Illustration / Branding (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-900 items-center justify-center overflow-hidden">
        {/* Animated Background elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none overflow-hidden">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              x: [0, 50, 0],
              y: [0, -50, 0]
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600 rounded-full mix-blend-screen filter blur-[100px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              x: [0, -80, 0],
              y: [0, 80, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-[40%] right-[-20%] w-[600px] h-[600px] bg-purple-600 rounded-full mix-blend-screen filter blur-[120px]" 
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.1, 1],
              x: [0, 100, 0],
              y: [0, 50, 0]
            }}
            transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 5 }}
            className="absolute bottom-[-10%] left-[20%] w-[400px] h-[400px] bg-indigo-500 rounded-full mix-blend-screen filter blur-[90px]" 
          />
        </div>
        
        {/* Glassmorphism content container */}
        <div className="relative z-10 text-center text-white p-12 max-w-xl bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">
           <motion.img 
             initial={{ scale: 0.8, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             src={logo} 
             alt="GenTech Audit" 
             className="w-32 h-32 mx-auto mb-8 drop-shadow-2xl rounded-[2rem] object-cover" 
           />
           <motion.h1 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 0.8, delay: 0.2 }}
             className="text-4xl font-extrabold mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200"
           >
             GenTech Audit
           </motion.h1>
           <motion.p 
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ duration: 0.8, delay: 0.4 }}
             className="text-lg text-blue-100 font-medium leading-relaxed"
           >
             Platform simulasi audit digital masa depan. Pelajari blockchain dan audit teknologi dengan cara yang interaktif.
           </motion.p>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Mobile Background Shapes */}
        <div className="lg:hidden absolute top-[-10%] right-[-10%] w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0"></div>
        <div className="lg:hidden absolute bottom-[-10%] left-[-10%] w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 z-0"></div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-md bg-white/80 backdrop-blur-xl lg:bg-transparent lg:backdrop-blur-none rounded-[2.5rem] p-8 sm:p-10 shadow-2xl lg:shadow-none border border-white/50 lg:border-none z-10"
        >
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-inner mb-4">
              <img src={logo} alt="GenTech Audit" className="w-20 h-20 rounded-2xl object-cover" />
            </div>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Selamat Datang 👋</h2>
            <p className="text-gray-500 font-medium">Silakan masuk untuk melanjutkan simulasi audit Anda.</p>
          </div>

          {loginError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3"
            >
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm font-medium text-red-700">{loginError}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setLoginError('');
                  }}
                  className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
                  placeholder="name@company.com"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setLoginError('');
                  }}
                  className="block w-full pl-11 pr-12 py-3.5 bg-gray-50/50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsResetSent(false);
                  setIsEmailNotFound(false);
                  setResetEmail('');
                  setIsResetModalOpen(true);
                }}
                className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors hover:underline"
              >
                Lupa Password?
              </button>
            </div>

            <div className="pt-4">
              <motion.button
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Memproses...' : 'Masuk Sekarang'}
                {!isLoading && <ArrowRight className="w-5 h-5" />}
              </motion.button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-sm">
            <p className="text-gray-500 font-medium">
              Belum memiliki akun?{' '}
              <button 
                type="button"
                onClick={() => window.location.href='/register'}
                className="text-blue-600 hover:text-blue-800 font-bold transition-colors ml-1 hover:underline underline-offset-4"
              >
                Daftar Gratis
              </button>
            </p>
          </div>
        </motion.div>
      </div>

      {/* MODAL LUPA PASSWORD (GLASSMORPHISM) */}
      <AnimatePresence>
        {isResetModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop dengan efek blur ekstrim */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsResetModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", bounce: 0.4 }}
              className="relative w-full max-w-md bg-white/95 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-white/50 overflow-hidden"
            >
              {/* Efek glow di dalam modal */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
              
              <button 
                onClick={() => setIsResetModalOpen(false)}
                className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center mb-5 shadow-inner ${
                  isResetSent ? 'bg-green-50 border-green-100' : 
                  isEmailNotFound ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'
                }`}>
                  {isResetSent ? (
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  ) : isEmailNotFound ? (
                    <X className="w-8 h-8 text-red-500" />
                  ) : (
                    <KeyRound className="w-8 h-8 text-blue-600" />
                  )}
                </div>
                
                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                  {isResetSent ? 'Email Terkirim!' : 
                   isEmailNotFound ? 'Email Tidak Terdaftar' : 'Lupa Password?'}
                </h3>
                
                <p className={`mb-8 font-medium text-sm px-2 ${isEmailNotFound ? 'text-red-500' : 'text-slate-500'}`}>
                  {isResetSent 
                    ? `Kami telah mengirimkan tautan reset password ke ${resetEmail || 'email Anda'}. Silakan cek kotak masuk Anda.`
                    : isEmailNotFound
                    ? `Email ${resetEmail} belum terdaftar di sistem kami. Silakan daftar akun baru terlebih dahulu.`
                    : 'Jangan khawatir! Masukkan email yang terdaftar, dan kami akan mengirimkan tautan untuk membuat password baru.'
                  }
                </p>

                {isEmailNotFound ? (
                  <div className="w-full space-y-3">
                    <button
                      type="button"
                      onClick={() => window.location.href='/register'}
                      className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95"
                    >
                      Daftar Akun Baru
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEmailNotFound(false);
                        setResetEmail('');
                      }}
                      className="w-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-all active:scale-95"
                    >
                      Coba Email Lain
                    </button>
                  </div>
                ) : !isResetSent ? (
                  <form 
                    className="w-full space-y-4"
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if(resetEmail && cooldown === 0) {
                        setIsCheckingEmail(true);
                        try {
                          const res = await fetch('http://localhost:8000/api/users');
                          const data = await res.json();
                          const users = data.data || [];
                          const exists = users.find((u: any) => u.email === resetEmail);
                          
                          if (exists) {
                            setIsResetSent(true);
                            setCooldown(60); 
                            localStorage.setItem('reset_cooldown_expiry', (Date.now() + 60000).toString());
                          } else {
                            setIsEmailNotFound(true);
                          }
                        } catch (error) {
                          // Fallback if API fails
                          setIsResetSent(true);
                          setCooldown(60); 
                          localStorage.setItem('reset_cooldown_expiry', (Date.now() + 60000).toString());
                        } finally {
                          setIsCheckingEmail(false);
                        }
                      }
                    }}
                  >
                    <div className="relative group text-left">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                      </div>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="block w-full pl-11 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                        placeholder="Masukkan alamat email Anda"
                        required
                        disabled={cooldown > 0 || isCheckingEmail}
                      />
                    </div>
                    
                    <button
                      type="submit"
                      disabled={cooldown > 0 || isCheckingEmail}
                      className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isCheckingEmail ? 'Memeriksa...' : cooldown > 0 ? `Tunggu ${cooldown} detik` : 'Kirim Tautan Reset'}
                    </button>
                  </form>
                ) : (
                  <div className="w-full space-y-3">
                    <button
                      type="button"
                      disabled={cooldown > 0}
                      onClick={() => {
                        if (cooldown === 0) {
                          setCooldown(60);
                          localStorage.setItem('reset_cooldown_expiry', (Date.now() + 60000).toString());
                          // Simulasi resend
                        }
                      }}
                      className="w-full flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-4 rounded-2xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {cooldown > 0 ? `Kirim Ulang (${cooldown}s)` : 'Kirim Ulang Tautan'}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setIsResetModalOpen(false)}
                      className="w-full flex items-center justify-center bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-2xl transition-all active:scale-95"
                    >
                      Kembali ke Login
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}