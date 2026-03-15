import React, { useState } from 'react';
import { Send, CheckCircle, Calculator } from 'lucide-react';
import { useLanguage } from './LanguageContext';

export const GetStartedForm: React.FC = () => {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  
  // Math captcha state
  const [num1] = useState(Math.floor(Math.random() * 10) + 1);
  const [num2] = useState(Math.floor(Math.random() * 10) + 1);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaError, setCaptchaError] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interest: '',
    branch: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parseInt(captchaAnswer) !== num1 + num2) {
      setCaptchaError(true);
      return;
    }
    setCaptchaError(false);
    
    // Simulate API submission
    setTimeout(() => {
      setSubmitted(true);
    }, 800);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="text-green-500" size={32} />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('form.success.title')}</h3>
        <p className="text-gray-600 mb-8 max-w-sm">
          {t('form.success.desc')}
        </p>
        <button 
          onClick={() => {
            setSubmitted(false);
            setFormData({ firstName: '', lastName: '', email: '', phone: '', interest: '', branch: '' });
            setCaptchaAnswer('');
          }}
          className="bg-lamar-navy text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-950 transition-colors"
        >
          {t('form.success.reset')}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-6 md:p-8 border border-gray-100 shadow-sm">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('form.title')}</h3>
        <p className="text-gray-600">
          {t('form.subtitle')}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1.5">{t('form.fname')} *</label>
            <input 
              required
              type="text" 
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-lamar-navy/50 focus:border-lamar-navy transition-colors"
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1.5">{t('form.lname')} *</label>
            <input 
              required
              type="text" 
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-lamar-navy/50 focus:border-lamar-navy transition-colors"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">{t('form.email')} *</label>
            <input 
              required
              type="email" 
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-lamar-navy/50 focus:border-lamar-navy transition-colors"
            />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">{t('form.phone')} *</label>
            <input 
              required
              type="tel" 
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-lamar-navy/50 focus:border-lamar-navy transition-colors"
            />
          </div>
        </div>

        <div>
          <label htmlFor="interest" className="block text-sm font-medium text-gray-700 mb-1.5">{t('form.interest')} *</label>
          <select 
            required
            id="interest"
            name="interest"
            value={formData.interest}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lamar-navy/50 focus:border-lamar-navy transition-colors appearance-none"
          >
            <option value="">-- {t('form.select')} --</option>
            <option value="Checking & Savings">{t('form.int.checking')}</option>
            <option value="Certificates of Deposit">{t('form.int.cd')}</option>
            <option value="Personal Loan / Mortgage">{t('form.int.personal')}</option>
            <option value="Business & Commercial Lending">{t('form.int.biz')}</option>
            <option value="Treasury Services">{t('form.int.treasury')}</option>
            <option value="Other">{t('form.int.other')}</option>
          </select>
        </div>

        <div>
          <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1.5">{t('form.branch')} *</label>
          <select 
            required
            id="branch"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-lamar-navy/50 focus:border-lamar-navy transition-colors appearance-none"
          >
            <option value="">-- {t('form.select')} --</option>
            <option value="Paris">Paris - Main Bank</option>
            <option value="Reno">Reno</option>
            <option value="North Tarrant">North Tarrant</option>
            <option value="Frisco">Frisco</option>
            <option value="Celina">Celina</option>
            <option value="Plano (LPO)">Plano (LPO)</option>
            <option value="Bryan (LPO)">Bryan (LPO)</option>
          </select>
        </div>

        {/* Math Captcha */}
        <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100 flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex items-center gap-3 text-lamar-navy font-medium shrink-0">
            <Calculator size={20} className="text-blue-500" />
            <span>{num1} + {num2} = ?</span>
          </div>
          <div className="flex-1">
             <input 
              required
              type="number" 
              placeholder={t('form.captcha.placeholder')}
              value={captchaAnswer}
              onChange={(e) => {
                  setCaptchaAnswer(e.target.value);
                  setCaptchaError(false);
              }}
              className={`w-full max-w-[200px] bg-white border ${captchaError ? 'border-red-300 focus:ring-red-500/50' : 'border-blue-200 focus:ring-lamar-navy/50'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 transition-colors`}
            />
            {captchaError && <p className="text-red-500 text-xs mt-1 absolute">{t('form.captcha.error')}</p>}
          </div>
        </div>

        <button 
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-lamar-navy hover:bg-blue-950 text-white font-bold py-3.5 px-6 rounded-lg transition-colors shadow-sm mt-4"
        >
          {t('form.submit')} <Send size={18} />
        </button>
      </form>
    </div>
  );
};
