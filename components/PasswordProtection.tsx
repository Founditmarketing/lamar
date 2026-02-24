import React, { useState, useEffect } from 'react';
import { Lock } from 'lucide-react';

interface PasswordProtectionProps {
    children: React.ReactNode;
}

export const PasswordProtection: React.FC<PasswordProtectionProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        const auth = sessionStorage.getItem('lamar_auth');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Temporary password: lamar
        if (password.toLowerCase() === 'lamar') {
            sessionStorage.setItem('lamar_auth', 'true');
            setIsAuthenticated(true);
            setError(false);
        } else {
            setError(true);
        }
    };

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-[#002C5F] flex flex-col items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
                <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                    <Lock className="w-8 h-8 text-[#002C5F]" />
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">Restricted Access</h1>
                <p className="text-gray-600 mb-8">Please enter the password to view this site.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError(false);
                            }}
                            placeholder="Enter password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                            autoFocus
                        />
                        {error && (
                            <p className="text-red-500 text-sm mt-2 text-left">Incorrect password</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[#002C5F] text-white font-semibold py-3 rounded-lg hover:bg-[#001e42] transition-colors"
                    >
                        Access Site
                    </button>
                </form>
            </div>
        </div>
    );
};
