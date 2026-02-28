import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { IdeasPage } from './pages/IdeasPage';
import { IdeaDetailPage } from './pages/IdeaDetailPage';
import { Toaster } from 'react-hot-toast';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <AppLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/ideas" replace />} />
          <Route path="/ideas" element={<IdeasPage />} />
          <Route path="/ideas/:id" element={<IdeaDetailPage />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
};


export default App;
