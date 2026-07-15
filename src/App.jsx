import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Layout from './components/layout/Layout';
import ChatBot from './components/chat/ChatBot';
import Dashboard from './pages/Dashboard';
import CrowdManagement from './pages/CrowdManagement';
import Navigation from './pages/Navigation';
import Transport from './pages/Transport';
import Emergency from './pages/Emergency';
import Sustainability from './pages/Sustainability';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/crowd" element={<CrowdManagement />} />
          <Route path="/navigation" element={<Navigation />} />
          <Route path="/transport" element={<Transport />} />
          <Route path="/emergency" element={<Emergency />} />
          <Route path="/sustainability" element={<Sustainability />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
      <ChatBot />
    </BrowserRouter>
  );
}
