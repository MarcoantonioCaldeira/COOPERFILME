import { useState } from 'react';
import { Entrar } from './components/Entrar';
import { TelaPrivada } from './components/TelaPrivada';
import { TelaInicio } from './components/TelaInicio';
import { EscreverRoteiro } from './components/EscreverRoteiro';
import { ChecarStatus } from './components/ChecarStatus';
import { DetalhesRoteiro } from './components/DetalhesRoteiro';
import type { FrontRole } from './utils/role';

type Page = 'public' | 'login' | 'dashboard' | 'submit' | 'check-status' | 'script-details';


export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('public');
  const [userRole, setUserRole] = useState<FrontRole | null>(null);
  const [selectedScriptId, setSelectedScriptId] = useState<number | null>(null);
  
  const handleLogin = (role: FrontRole) => {
    setUserRole(role);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUserRole(null);
    setCurrentPage('public');
  };

  const handleViewScript = (scriptId: number) => {
    setSelectedScriptId(scriptId);
    setCurrentPage('script-details');
  };

  const handleBackToDashboard = () => {
    setSelectedScriptId(null);
    setCurrentPage('dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'public' && (
        <TelaInicio onNavigate={setCurrentPage} />
      )}

      {currentPage === 'login' && (
        <Entrar onLogin={handleLogin} onBack={() => setCurrentPage('public')} />
      )}

      {currentPage === 'dashboard' && userRole && (
        <TelaPrivada userRole={userRole} onLogout={handleLogout} onViewScript={handleViewScript} />
      )}

      {currentPage === 'submit' && (
        <EscreverRoteiro onBack={() => setCurrentPage('public')} />
      )}

      {currentPage === 'check-status' && (
        <ChecarStatus onBack={() => setCurrentPage('public')} />
      )}

      {currentPage === 'script-details' && userRole && selectedScriptId !== null && (
        <DetalhesRoteiro scriptId={selectedScriptId} userRole={userRole} onBack={handleBackToDashboard} />
      )}
    </div>
  );
}