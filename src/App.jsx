import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import ChatBot from './components/chat/ChatBot';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const CrowdManagement = lazy(() => import('./pages/CrowdManagement'));
const Navigation = lazy(() => import('./pages/Navigation'));
const Transport = lazy(() => import('./pages/Transport'));
const Emergency = lazy(() => import('./pages/Emergency'));
const Sustainability = lazy(() => import('./pages/Sustainability'));
const Settings = lazy(() => import('./pages/Settings'));
const Landing = lazy(() => import('./pages/Landing'));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', width: '100vw', background: 'var(--bg-primary)', gap: '6px' }}>
          <div className="chat-typing-dot" style={{ width: 10, height: 10, background: 'var(--accent-primary)' }} />
          <div className="chat-typing-dot" style={{ width: 10, height: 10, background: 'var(--accent-primary)', animationDelay: '0.2s' }} />
          <div className="chat-typing-dot" style={{ width: 10, height: 10, background: 'var(--accent-primary)', animationDelay: '0.4s' }} />
        </div>
      }>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/crowd" element={<CrowdManagement />} />
            <Route path="/navigation" element={<Navigation />} />
            <Route path="/transport" element={<Transport />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/sustainability" element={<Sustainability />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
      <ChatBot />
    </BrowserRouter>
  );
}
