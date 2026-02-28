import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastOptions {
    message: string;
    type: ToastType;
}

interface ToastContextState {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextState | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [toast, setToast] = useState<ToastOptions | null>(null);

    const showToast = useCallback((message: string, type: ToastType) => {
        setToast({ message, type });
        // Auto-dismiss after 4 seconds
        setTimeout(() => {
            setToast(null);
        }, 4000);
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-md shadow-md transition-all duration-300 transform translate-y-0 opacity-100 ${toast.type === 'error' ? 'bg-red-50 text-red-800 border border-red-100' :
                        toast.type === 'success' ? 'bg-green-50 text-green-800 border border-green-100' :
                            'bg-white text-gray-800 border border-gray-100'
                    }`}>
                    <div className="flex items-center gap-2">
                        {toast.type === 'error' && (
                            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        )}
                        {toast.type === 'success' && (
                            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                        )}
                        <span className="text-sm font-medium">{toast.message}</span>
                    </div>
                </div>
            )}
        </ToastContext.Provider>
    );
};
