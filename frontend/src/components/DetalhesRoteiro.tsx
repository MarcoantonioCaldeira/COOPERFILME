import { useState } from 'react';
import { ArrowLeft, User, Calendar, CheckCircle, XCircle, UserCheck } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Separator } from './ui/separator';

type UserRole = 'analyst' | 'reviewer' | 'approver';

interface ScriptDetailsProps {
  scriptId: string;
  userRole: UserRole;
  onBack: () => void;
}

interface ScriptData {
  id: string;
  title: string;
  author: string;
  email: string;
  phone: string;
  content: string;
  status: string;
  submittedDate: string;
  assignedTo: string | null;
  votes?: { user: string; vote: 'for' | 'against' }[];
  history: { status: string; date: string; user: string; note?: string }[];
}

// Mock data
const mockScriptData: Record<string, ScriptData> = {
  'ROT-ABC123': {
    id: 'ROT-ABC123',
    title: 'A Jornada do Herói',
    author: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 98765-4321',
    content: `INT. CASA - DIA

JOÃO, um jovem escritor de 25 anos, está sentado em frente ao computador. Ele digita furiosamente, mas para de repente, frustrado.

JOÃO
(para si mesmo)
Isso não está funcionando...

Ele apaga tudo e recomeça. A câmera foca em seus olhos determinados.

FADE OUT.

---

Este é um exemplo de roteiro para demonstração do sistema COOPERFILME. Em um cenário real, o conteúdo completo do roteiro seria exibido aqui, incluindo todas as cenas, diálogos, descrições de ação e notas de produção.`,
    status: 'in-review',
    submittedDate: '2025-10-10',
    assignedTo: 'Maria Santos',
    history: [
      { status: 'submitted', date: '2025-10-10', user: 'Sistema' },
      { status: 'in-analysis', date: '2025-10-11', user: 'Carlos Mendes', note: 'Iniciando análise do roteiro' },
      { status: 'approved-for-review', date: '2025-10-12', user: 'Carlos Mendes', note: 'Roteiro aprovado para revisão. Boa estrutura narrativa.' },
      { status: 'in-review', date: '2025-10-13', user: 'Maria Santos', note: 'Assumindo revisão do roteiro' }
    ]
  },
  'ROT-XYZ789': {
    id: 'ROT-XYZ789',
    title: 'Noite Estrelada',
    author: 'Ana Costa',
    email: 'ana@email.com',
    phone: '(21) 99876-5432',
    content: `EXT. CAMPO ABERTO - NOITE

Sob um céu estrelado, MARIA (30) caminha sozinha. Ela olha para cima, maravilhada com as estrelas.

MARIA
(sussurrando)
Talvez amanhã seja diferente...

Ela se senta na grama e abraça os joelhos, contemplativa.

CORTA PARA:

---

Exemplo de roteiro demonstrativo. O conteúdo completo incluiria todas as cenas, personagens, diálogos e direções técnicas necessárias para a produção.`,
    status: 'pending-analysis',
    submittedDate: '2025-10-14',
    assignedTo: null,
    history: [
      { status: 'submitted', date: '2025-10-14', user: 'Sistema' }
    ]
  },
  'ROT-GHI789': {
    id: 'ROT-GHI789',
    title: 'Amor em Tempos Modernos',
    author: 'Julia Santos',
    email: 'julia@email.com',
    phone: '(31) 97654-3210',
    content: `INT. CAFÉ - TARDE

LUCAS (28) e CLARA (26) estão sentados em uma mesa. Há uma tensão palpável entre eles.

CLARA
Você não entende o que eu estou tentando dizer...

LUCAS
Então me explica de novo. Eu quero entender.

Clara suspira, mexendo nervosamente na xícara de café.

---

Roteiro de exemplo para demonstração. O roteiro completo conteria todas as cenas necessárias para contar a história completa.`,
    status: 'pending-approval',
    submittedDate: '2025-10-08',
    assignedTo: null,
    votes: [
      { user: 'Roberto Almeida', vote: 'for' },
      { user: 'Patricia Costa', vote: 'for' }
    ],
    history: [
      { status: 'submitted', date: '2025-10-08', user: 'Sistema' },
      { status: 'in-analysis', date: '2025-10-09', user: 'Carlos Mendes' },
      { status: 'approved-for-review', date: '2025-10-10', user: 'Carlos Mendes' },
      { status: 'in-review', date: '2025-10-11', user: 'Maria Santos' },
      { status: 'approved-for-voting', date: '2025-10-13', user: 'Maria Santos' },
      { status: 'pending-approval', date: '2025-10-13', user: 'Sistema' }
    ]
  }
};

export function DetalhesRoteiro({ scriptId, userRole, onBack }: ScriptDetailsProps) {
  const [note, setNote] = useState('');
  const [actionTaken, setActionTaken] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  const script = mockScriptData[scriptId];

  if (!script) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto pt-8">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <Card className="mt-4">
            <CardContent className="p-12 text-center">
              <p className="text-gray-600">Roteiro não encontrado</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const handleAction = (action: string) => {
    const messages: Record<string, string> = {
      'assume-analysis': 'Você assumiu a análise deste roteiro.',
      'approve-for-review': 'Roteiro aprovado e enviado para revisão.',
      'reject': 'Roteiro recusado.',
      'assume-review': 'Você assumiu a revisão deste roteiro.',
      'send-to-approval': 'Roteiro enviado para aprovação.',
      'vote-for': 'Seu voto a favor foi registrado.',
      'vote-against': 'Seu voto contra foi registrado.'
    };

    setActionMessage(messages[action] || 'Ação realizada com sucesso.');
    setActionTaken(true);
    setTimeout(() => setActionTaken(false), 5000);
  };

  const canTakeAction = (): boolean => {
    if (userRole === 'analyst') {
      return script.status === 'pending-analysis' || script.status === 'in-analysis';
    } else if (userRole === 'reviewer') {
      return script.status === 'pending-review' || script.status === 'in-review';
    } else if (userRole === 'approver') {
      return script.status === 'pending-approval' || script.status === 'in-approval';
    }
    return false;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {actionTaken && (
          <Alert className="mb-6 border-green-600 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {actionMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Script Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>{script.title}</CardTitle>
                    <p className="text-sm text-gray-600 mt-2">ID: {script.id}</p>
                  </div>
                  <Badge className={
                    script.status === 'approved' ? 'bg-green-100 text-green-800' :
                    script.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }>
                    {script.status.replace('-', ' ').toUpperCase()}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Autor</p>
                      <p>{script.author}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Data de Envio</p>
                      <p>{new Date(script.submittedDate).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">E-mail</p>
                    <p>{script.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Telefone</p>
                    <p>{script.phone}</p>
                  </div>
                </div>
                {script.assignedTo && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-600">Responsável Atual</p>
                        <p>{script.assignedTo}</p>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Script Content */}
            <Card>
              <CardHeader>
                <CardTitle>Conteúdo do Roteiro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-6 rounded-lg border">
                  <pre className="whitespace-pre-wrap font-mono text-sm">
                    {script.content}
                  </pre>
                </div>
              </CardContent>
            </Card>

            {/* Voting Results (for approvers) */}
            {userRole === 'approver' && script.votes && (
              <Card>
                <CardHeader>
                  <CardTitle>Votação</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {script.votes.map((vote, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>{vote.user}</span>
                        <Badge variant={vote.vote === 'for' ? 'outline' : 'secondary'} 
                               className={vote.vote === 'for' ? 'border-green-600 text-green-700' : 'border-red-600 text-red-700'}>
                          {vote.vote === 'for' ? 'A Favor' : 'Contra'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            {canTakeAction() && (
              <Card>
                <CardHeader>
                  <CardTitle>Ações</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userRole === 'analyst' && (
                    <>
                      {script.status === 'pending-analysis' && (
                        <Button 
                          className="w-full" 
                          onClick={() => handleAction('assume-analysis')}
                        >
                          Assumir Análise
                        </Button>
                      )}
                      {script.status === 'in-analysis' && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="note">Observações</Label>
                            <Textarea
                              id="note"
                              placeholder="Adicione suas observações sobre o roteiro..."
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <Button 
                            className="w-full" 
                            onClick={() => handleAction('approve-for-review')}
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Aprovar para Revisão
                          </Button>
                          <Button 
                            className="w-full" 
                            variant="destructive"
                            onClick={() => handleAction('reject')}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Recusar Roteiro
                          </Button>
                        </>
                      )}
                    </>
                  )}

                  {userRole === 'reviewer' && (
                    <>
                      {script.status === 'pending-review' && (
                        <Button 
                          className="w-full" 
                          onClick={() => handleAction('assume-review')}
                        >
                          Assumir Revisão
                        </Button>
                      )}
                      {script.status === 'in-review' && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="note">Observações da Revisão</Label>
                            <Textarea
                              id="note"
                              placeholder="Adicione suas observações sobre a revisão..."
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                              rows={4}
                            />
                          </div>
                          <Button 
                            className="w-full" 
                            onClick={() => handleAction('send-to-approval')}
                          >
                            Enviar para Aprovação
                          </Button>
                        </>
                      )}
                    </>
                  )}

                  {userRole === 'approver' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="note">Justificativa do Voto</Label>
                        <Textarea
                          id="note"
                          placeholder="Adicione uma justificativa para seu voto..."
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <Button 
                        className="w-full" 
                        onClick={() => handleAction('vote-for')}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Votar a Favor
                      </Button>
                      <Button 
                        className="w-full" 
                        variant="outline"
                        onClick={() => handleAction('vote-against')}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Votar Contra
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            {/* History */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {script.history.map((item, index) => (
                    <div key={index} className="relative pl-6 pb-4 border-l-2 border-gray-200 last:border-l-0 last:pb-0">
                      <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600"></div>
                      <div>
                        <p className="text-sm">{item.status.replace('-', ' ').toUpperCase()}</p>
                        <p className="text-xs text-gray-600">{item.user}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.date).toLocaleDateString('pt-BR')}
                        </p>
                        {item.note && (
                          <p className="text-xs text-gray-700 mt-1 italic">"{item.note}"</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}