import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
    children: ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
    return (
        <div className="flex h-screen w-full bg-gray-100 overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-auto bg-gray-100">
                {children}
            </main>
        </div>
    );
};
