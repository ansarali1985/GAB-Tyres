
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../AppContext';
import { Lock, User, Eye, EyeOff } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(username, password)) {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-blue-600 rounded-3xl mx-auto flex items-center justify-center text-white mb-6 shadow-xl shadow-blue-200">
            <Lock size={32} />
          </div>
          <h1 className="text-3xl font-black text-gray-900">Admin Portal</h1>
          <p className="text-gray-500 mt-2 font-medium">Please enter your credentials to continue</p>
        </div>

        <div className="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-2xl mb-6 text-sm font-bold text-center border border-red-100 animate-bounce">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  required
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-14 pr-6 py-4 focus:outline-none focus:border-blue-500 transition-all font-bold text-slate-900 placeholder-slate-400"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl pl-14 pr-16 py-4 focus:outline-none focus:border-blue-500 transition-all font-bold text-slate-900 placeholder-slate-400"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-900 text-white py-5 rounded-2xl font-black text-xl shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Sign In
            </button>
          </form>

          <button
            onClick={() => navigate('/')}
            className="w-full mt-6 text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest"
          >
            Cancel and Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
