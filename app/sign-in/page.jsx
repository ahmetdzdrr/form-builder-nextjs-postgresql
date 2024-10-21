"use client";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import jwt from 'jwt-simple';
import { toast, ToastContainer } from 'react-toastify';
import { Eye, EyeOff } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const SignIn = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const secret = process.env.NEXT_PUBLIC_JWT_SECRET || 'default_secret_key';

  const handleSignIn = () => {
    if (username === process.env.NEXT_PUBLIC_USERNAME && password === process.env.NEXT_PUBLIC_PASSWORD) {
      const token = jwt.encode({ username, exp: Date.now() + 60 * 60 * 1000 }, secret);
      localStorage.setItem('token', token);
      router.push('/dashboard');
      
    } else {
      toast.error('Geçersiz kullanıcı adı veya şifre');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        router.push('/dashboard');
      }
    }
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <ToastContainer />
      <div className="w-full max-w-md p-8 space-y-4 bg-white rounded shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">Oturum Aç</h1>
        <input
          type="text"
          placeholder="Kullanıcı Adı"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border-b border-gray-300 rounded focus:outline-none focus:border-b-red-500"
        />
        
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'} // Şifre alanını type'a göre değiştir
            placeholder="Parola"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 pr-10 border-b border-gray-300 rounded focus:outline-none focus:border-b-red-500"
          />
          <div
            className="absolute inset-y-0 right-0 flex items-center px-2 cursor-pointer"
            onClick={togglePasswordVisibility}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />} {/* Göz ikonunu değiştir */}
          </div>
        </div>
        
        <button
          onClick={handleSignIn}
          className="w-full py-2 text-white bg-red-600 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Giriş Yap
        </button>
      </div>
    </div>
  );
};

export default SignIn;
