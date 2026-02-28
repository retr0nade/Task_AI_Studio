import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { IdeasPage } from './pages/IdeasPage';
import { IdeaDetailPage } from './pages/IdeaDetailPage';
import { ToastProvider } from './components/ToastProvider';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Navigate to="/ideas" replace />} />
            <Route path="/ideas" element={<IdeasPage />} />
            <Route path="/ideas/:id" element={<IdeaDetailPage />} />
          </Routes>
        </AppLayout>
      </ToastProvider>
    </BrowserRouter>
  );
};


export default App;
