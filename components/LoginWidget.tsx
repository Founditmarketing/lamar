import React, { useState } from 'react';
import { ChevronDown, Eye, EyeOff, Lock } from 'lucide-react';
import { useLanguage } from './LanguageContext';

interface LoginWidgetProps {
  onNavigate?: (page: string) => void;
}

export const LoginWidget: React.FC<LoginWidgetProps> = ({ onNavigate }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { t } = useLanguage();

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-[360px] border border-white/50 relative overflow-hidden group">
      {/* Decorative top shimmer */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lamar-blue via-blue-400 to-lamar-blue"></div>

      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('login.welcome')}</h2>
        <Lock size={16} className="text-gray-400" />
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
        {/* Username Field */}
        <div className="relative group/input">
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-lamar-blue focus:bg-white transition-all peer"
            placeholder={t('login.user')}
          />
          <label
            htmlFor="username"
            className="absolute left-4 -top-2.5 bg-white px-1 text-xs font-semibold text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-lamar-blue peer-focus:bg-white rounded"
          >
            {t('login.user')}
          </label>
        </div>

        {/* Password Field */}
        <div className="relative group/input">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-transparent focus:outline-none focus:ring-2 focus:ring-lamar-blue focus:bg-white transition-all pr-12 peer"
            placeholder={t('login.pass')}
          />
          <label
            htmlFor="password"
            className="absolute left-4 -top-2.5 bg-white px-1 text-xs font-semibold text-gray-500 transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-placeholder-shown:top-3.5 peer-placeholder-shown:bg-transparent peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-lamar-blue peer-focus:bg-white rounded"
          >
            {t('login.pass')}
          </label>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-lamar-blue focus:outline-none transition-colors"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {/* Remember Me / Token */}
        <div className="flex items-center justify-between mt-1">
          <label className="flex items-center text-xs md:text-sm text-gray-600 cursor-pointer hover:text-gray-900 transition-colors">
            <input type="checkbox" className="h-4 w-4 text-lamar-blue focus:ring-lamar-blue border-gray-300 rounded cursor-pointer" />
            <span className="ml-2 font-medium">{t('login.remember')}</span>
          </label>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('resources'); }}
            className="text-xs md:text-sm text-lamar-blue font-semibold hover:text-blue-700 transition-colors"
          >
            {t('login.token')}
          </a>
        </div>

        {/* Sign In Button */}
        <button
          type="submit"
          className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-600/20 text-sm font-bold text-white bg-lamar-accent hover:bg-blue-700 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lamar-accent"
        >
          {t('login.signin')}
        </button>

        {/* Helper Links */}
        <div className="text-center pt-2 space-y-3 border-t border-gray-100 mt-2">
          <button onClick={() => onNavigate && onNavigate('contact')} className="block text-sm text-gray-500 hover:text-lamar-blue transition-colors font-medium">{t('login.forgot')}</button>
          <button
            onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('personal'); }}
            className="text-sm font-bold text-lamar-blue hover:text-blue-800 transition-colors"
          >
            {t('login.enroll')}
          </button>
        </div>
      </form>
    </div>
  );
};
