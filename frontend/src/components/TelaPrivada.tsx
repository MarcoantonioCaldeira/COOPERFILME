import { useState, useEffect } from "react";
import { Film, LogOut, FileText, Clock, CheckCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { roteiroService, authService } from "../services/api";

type UserRole = "analyst" | "reviewer" | "approver";

type ScriptStatus =
  | "AGUARDANDO_ANALISE"
  | "EM_ANALISE"
  | "AGUARDANDO_REVISAO"
  | "EM_REVISAO"
  | "AGUARDANDO_APROVACAO"
  | "EM_APROVACAO"
  | "APROVADO"
  | "RECUSADO";

interface DashboardProps {
  userRole: UserRole;
  onLogout: () => void;
  onViewScript: (scriptId: number) => void;
}

interface Script {
  id: number;
  title: string;
  author: string;
  status: ScriptStatus;
  submittedDate: string;
  assignedTo: string | null;
}

export function TelaPrivada({ userRole, onLogout, onViewScript }: DashboardProps) {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const user = authService.getCurrentUser();

  useEffect(() => {
    const fetchScripts = async () => {
      setLoading(true);
      try {
        const data = await roteiroService.listar();
        const mapped = data.map((r: any) => ({
          id: r.id,
          title: r.titulo,
          author: r.cliente.nome,
          status: r.status,
          assignedTo: r.usuarioResponsavel?.nome || null,
          submittedDate: r.dataEnvio || r.dataRegistro || new Date().toISOString(),
        }));
        setScripts(mapped);
      } catch (e) {
        console.error("Erro ao buscar roteiros:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchScripts();
  }, [user?.id]);

  const getRoleLabel = (role: UserRole): string => {
    const labels = { analyst: "Analista", reviewer: "Revisor", approver: "Aprovador" };
    return labels[role];
  };

  const getStatusBadge = (status: ScriptStatus) => {
    const config = {
      AGUARDANDO_ANALISE: { label: "Aguardando Análise", color: "bg-gray-200" },
      EM_ANALISE: { label: "Em Análise", color: "bg-blue-100 text-blue-800" },
      AGUARDANDO_REVISAO: { label: "Aguardando Revisão", color: "bg-gray-200" },
      EM_REVISAO: { label: "Em Revisão", color: "bg-blue-100 text-blue-800" },
      AGUARDANDO_APROVACAO: { label: "Aguardando Aprovação", color: "bg-gray-200" },
      EM_APROVACAO: { label: "Em Aprovação", color: "bg-blue-100 text-blue-800" },
      APROVADO: { label: "Aprovado", color: "bg-green-100 text-green-800" },
      RECUSADO: { label: "Recusado", color: "bg-red-100 text-red-800" },
    } as const;

    const cfg = config[status];
    if (!cfg) return <Badge variant="outline">Status desconhecido</Badge>;

    return <Badge className={`${cfg.color} font-medium`}>{cfg.label}</Badge>;
  };

  const filteredScripts = scripts
    .filter((s) => (filterStatus === "all" ? true : s.status === filterStatus))
    .filter((s) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      return (
        s.title.toLowerCase().includes(term) ||
        s.author.toLowerCase().includes(term) ||
        s.id.toString().includes(term)
      );
    });

  const metrics = {
    pending: scripts.filter((s) =>
      ["AGUARDANDO_ANALISE", "AGUARDANDO_REVISAO", "AGUARDANDO_APROVACAO"].includes(s.status)
    ).length,
    inProgress: scripts.filter((s) =>
      ["EM_ANALISE", "EM_REVISAO", "EM_APROVACAO"].includes(s.status)
    ).length,
    approved: scripts.filter((s) => s.status === "APROVADO").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Film className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-blue-900 font-semibold">COOPERFILME</h1>
              <p className="text-sm text-gray-600">{getRoleLabel(userRole)}</p>
            </div>
          </div>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="h-4 w-4 mr-2" /> Sair
          </Button>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* MÉTRICAS */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Pendentes</CardTitle>
              <Clock className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 text-xl">{metrics.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Em Andamento</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 text-xl">{metrics.inProgress}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">Aprovados (Total)</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-gray-900 text-xl">{metrics.approved}</div>
            </CardContent>
          </Card>
        </div>

        {/* FILTROS */}
        <Card className="mb-6">
          <CardContent className="pt-6 flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Buscar por título, autor ou ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="sm:w-[200px]">
                <SelectValue placeholder="Filtrar por status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="AGUARDANDO_ANALISE">Aguardando Análise</SelectItem>
                <SelectItem value="EM_ANALISE">Em Análise</SelectItem>
                <SelectItem value="AGUARDANDO_REVISAO">Aguardando Revisão</SelectItem>
                <SelectItem value="EM_REVISAO">Em Revisão</SelectItem>
                <SelectItem value="AGUARDANDO_APROVACAO">Aguardando Aprovação</SelectItem>
                <SelectItem value="EM_APROVACAO">Em Aprovação</SelectItem>
                <SelectItem value="APROVADO">Aprovado</SelectItem>
                <SelectItem value="RECUSADO">Recusado</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* LISTA DE ROTEIROS */}
        <Card>
          <CardHeader>
            <CardTitle>Roteiros</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center text-gray-500 py-6">Carregando roteiros...</p>
            ) : filteredScripts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Nenhum roteiro encontrado</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredScripts.map((script) => (
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
                        <span>
                          Enviado:{" "}
                          {new Date(script.submittedDate).toLocaleDateString("pt-BR")}
                        </span>
                        {script.assignedTo && <span>Responsável: {script.assignedTo}</span>}
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
