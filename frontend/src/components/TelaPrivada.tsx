import { useState } from 'react';
import { Film, LogOut, FileText, Clock, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

type UserRole = 'analyst' | 'reviewer' | 'approver';
type ScriptStatus = 'pending-analysis' | 'in-analysis' | 'pending-review' | 'in-review' | 'pending-approval' | 'in-approval' | 'approved' | 'rejected';

interface DashboardProps {
  userRole: UserRole;
  onLogout: () => void;
  onViewScript: (scriptId: string) => void;
}

interface Script {
  id: string;
  title: string;
  author: string;
  status: ScriptStatus;
  submittedDate: string;
  assignedTo: string | null;
}

// Mock data
const mockScripts: Script[] = [
  {
    id: 'ROT-ABC123',
    title: 'A Jornada do Herói',
    author: 'João Silva',
    status: 'in-review',
    submittedDate: '2025-10-10',
    assignedTo: 'Maria Santos'
  },
  {
    id: 'ROT-XYZ789',
    title: 'Noite Estrelada',
    author: 'Ana Costa',
    status: 'pending-analysis',
    submittedDate: '2025-10-14',
    assignedTo: null
  },
  {
    id: 'ROT-DEF456',
    title: 'O Último Suspiro',
    author: 'Pedro Alves',
    status: 'in-analysis',
    submittedDate: '2025-10-12',
    assignedTo: 'Carlos Mendes'
  },
  {
    id: 'ROT-GHI789',
    title: 'Amor em Tempos Modernos',
    author: 'Julia Santos',
    status: 'pending-approval',
    submittedDate: '2025-10-08',
    assignedTo: null
  },
  {
    id: 'ROT-JKL012',
    title: 'A Cidade Perdida',
    author: 'Rafael Lima',
    status: 'approved',
    submittedDate: '2025-10-05',
    assignedTo: null
  },
  {
    id: 'ROT-MNO345',
    title: 'Sombras do Passado',
    author: 'Beatriz Oliveira',
    status: 'rejected',
    submittedDate: '2025-10-07',
    assignedTo: null
  }
];

export function TelaPrivada({ userRole, onLogout, onViewScript }: DashboardProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const getRoleLabel = (role: UserRole): string => {
    const labels = {
      analyst: 'Analista',
      reviewer: 'Revisor',
      approver: 'Aprovador'
    };
    return labels[role];
  };

  const getStatusBadge = (status: ScriptStatus) => {
    const statusConfig = {
      'pending-analysis': { label: 'Aguardando Análise', variant: 'secondary' as const },
      'in-analysis': { label: 'Em Análise', variant: 'default' as const },
      'pending-review': { label: 'Aguardando Revisão', variant: 'secondary' as const },
      'in-review': { label: 'Em Revisão', variant: 'default' as const },
      'pending-approval': { label: 'Aguardando Aprovação', variant: 'secondary' as const },
      'in-approval': { label: 'Em Aprovação', variant: 'default' as const },
      'approved': { label: 'Aprovado', variant: 'outline' as const },
      'rejected': { label: 'Recusado', variant: 'outline' as const }
    };

    const config = statusConfig[status];
    const className = status === 'approved' ? 'border-green-600 text-green-700' : 
                     status === 'rejected' ? 'border-red-600 text-red-700' : '';

    return (
      <Badge variant={config.variant} className={className}>
        {config.label}
      </Badge>
    );
  };

  const getRelevantScripts = (): Script[] => {
    let filtered = mockScripts;

    // Filter by user role
    if (userRole === 'analyst') {
      filtered = mockScripts.filter(s => 
        s.status === 'pending-analysis' || s.status === 'in-analysis'
      );
    } else if (userRole === 'reviewer') {
      filtered = mockScripts.filter(s => 
        s.status === 'pending-review' || s.status === 'in-review'
      );
    } else if (userRole === 'approver') {
      filtered = mockScripts.filter(s => 
        s.status === 'pending-approval' || s.status === 'in-approval'
      );
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(s => s.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(s => 
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  };

  const getMetrics = () => {
    let allScripts = mockScripts;
    
    if (userRole === 'analyst') {
      allScripts = mockScripts.filter(s => 
        s.status === 'pending-analysis' || s.status === 'in-analysis'
      );
    } else if (userRole === 'reviewer') {
      allScripts = mockScripts.filter(s => 
        s.status === 'pending-review' || s.status === 'in-review'
      );
    } else if (userRole === 'approver') {
      allScripts = mockScripts.filter(s => 
        s.status === 'pending-approval' || s.status === 'in-approval'
      );
    }

    const pending = allScripts.filter(s => 
      s.status.startsWith('pending-')
    ).length;

    const inProgress = allScripts.filter(s => 
      s.status.startsWith('in-')
    ).length;

    const approved = mockScripts.filter(s => s.status === 'approved').length;

    return { pending, inProgress, approved };
  };

  const metrics = getMetrics();
  const scripts = getRelevantScripts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Film className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-blue-900">COOPERFILME</h1>
                <p className="text-sm text-gray-600">{getRoleLabel(userRole)}</p>
              </div>
            </div>
            <Button variant="outline" onClick={onLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{metrics.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Em Andamento</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{metrics.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Aprovados (Total)</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900">{metrics.approved}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por título, autor ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="sm:w-[200px]">
                  <SelectValue placeholder="Filtrar por status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  {userRole === 'analyst' && (
                    <>
                      <SelectItem value="pending-analysis">Aguardando Análise</SelectItem>
                      <SelectItem value="in-analysis">Em Análise</SelectItem>
                    </>
                  )}
                  {userRole === 'reviewer' && (
                    <>
                      <SelectItem value="pending-review">Aguardando Revisão</SelectItem>
                      <SelectItem value="in-review">Em Revisão</SelectItem>
                    </>
                  )}
                  {userRole === 'approver' && (
                    <>
                      <SelectItem value="pending-approval">Aguardando Aprovação</SelectItem>
                      <SelectItem value="in-approval">Em Aprovação</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Scripts List */}
        <Card>
          <CardHeader>
            <CardTitle>Roteiros</CardTitle>
          </CardHeader>
          <CardContent>
            {scripts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum roteiro encontrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {scripts.map((script) => (
                  <div 
                    key={script.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1 mb-3 sm:mb-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-gray-900">{script.title}</h3>
                        {getStatusBadge(script.status)}
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                        <span>ID: {script.id}</span>
                        <span>Autor: {script.author}</span>
                        <span>Enviado: {new Date(script.submittedDate).toLocaleDateString('pt-BR')}</span>
                        {script.assignedTo && (
                          <span>Responsável: {script.assignedTo}</span>
                        )}
                      </div>
                    </div>
                    <Button 
                      onClick={() => onViewScript(script.id)}
                      variant="outline"
                      className="w-full sm:w-auto"
                    >
                      Ver Detalhes
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
