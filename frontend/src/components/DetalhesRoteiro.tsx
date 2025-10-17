import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, XCircle, UserCheck, Calendar } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Alert, AlertDescription } from "./ui/alert";
import { roteiroService, authService } from "../services/api";
import type { FrontRole } from "../utils/role";

type RoteiroAcao =
  | "ASSUMIR_ANALISE"
  | "APROVAR_PARA_REVISAO"
  | "RECUSAR"
  | "ASSUMIR_REVISAO"
  | "ENVIAR_PARA_APROVACAO"
  | "VOTAR_A_FAVOR"
  | "VOTAR_CONTRA";

interface Props {
  scriptId: number;
  userRole: FrontRole;
  onBack: () => void;
}

export function DetalhesRoteiro({ scriptId, userRole, onBack }: Props) {
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [script, setScript] = useState<any>(null);

  const user = authService.getCurrentUser();
  const uid = user?.id;

  const withToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const fetchScript = async () => {
      try {
        const data = await roteiroService.pegarPorId(scriptId);
        setScript(data);
      } catch (e) {
        console.error("Erro ao buscar roteiro:", e);
        withToast("Falha ao carregar detalhes do roteiro.");
      }
    };
    fetchScript();
  }, [scriptId]);

  const getStatusBadge = (status: string) => {
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

    const cfg = config[status as keyof typeof config];
    if (!cfg) return <Badge variant="outline">Desconhecido</Badge>;
    return <Badge className={`${cfg.color} font-medium`}>{cfg.label}</Badge>;
  };

  const doAction = async (acao: RoteiroAcao) => {
    if (!uid) return withToast("Sessão expirada. Faça login novamente.");
    setLoading(true);
    try {
      switch (acao) {
        case "ASSUMIR_ANALISE":
          await roteiroService.assumirAnalise(scriptId, uid);
          break;

        case "APROVAR_PARA_REVISAO":
          await roteiroService.analisar(scriptId, uid, {
            justificativa: note,
            apto: true,
          });
          break;

        case "RECUSAR":
          await roteiroService.analisar(scriptId, uid, {
            justificativa: note || "Recusado",
            apto: false,
          });
          break;

        case "ASSUMIR_REVISAO":
          await roteiroService.assumirRevisao(scriptId, uid);
          break;

        case "ENVIAR_PARA_APROVACAO":
          await roteiroService.revisar(scriptId, uid, { observacoes: note });
          break;

        case "VOTAR_A_FAVOR":
          await roteiroService.votar(scriptId, uid, {
            aprovado: true,
            justificativa: note,
          });
          break;

        case "VOTAR_CONTRA":
          await roteiroService.votar(scriptId, uid, {
            aprovado: false,
            justificativa: note,
          });
          break;
      }

      withToast("Ação realizada com sucesso.");
      setNote("");

      // Atualiza o roteiro com os novos dados
      const updated = await roteiroService.pegarPorId(scriptId);
      setScript(updated);

    } catch (e: any) {
      console.error("Erro ao executar ação:", e);
      withToast(e?.response?.data?.message || "Falha ao executar ação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar ao Dashboard
          </Button>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {toast && (
          <Alert className="mb-2 border-green-600 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{toast}</AlertDescription>
          </Alert>
        )}

        {/* DETALHES */}
        <Card>
          <CardHeader className="flex items-start justify-between">
            <div>
              <CardTitle>Roteiro #{script?.id ?? scriptId}</CardTitle>
              <p className="text-sm text-gray-600 mt-2">ID: {scriptId}</p>
            </div>
            {script?.status && getStatusBadge(script.status)}
          </CardHeader>

          <CardContent className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Responsável Atual</p>
                <p>{script?.usuarioResponsavel?.nome || "—"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-sm text-gray-600">Data de Envio</p>
                <p>
                  {script?.dataEnvio
                    ? new Date(script.dataEnvio).toLocaleDateString("pt-BR")
                    : "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* AÇÕES */}
        <Card>
          <CardHeader>
            <CardTitle>Ações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* ANALISTA */}
            {userRole === "ANALISTA" && (
              <>
                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={() => doAction("ASSUMIR_ANALISE")}
                >
                  {loading ? "Processando..." : "Assumir Análise"}
                </Button>

                <div className="space-y-2">
                  <Label>Observações</Label>
                  <Textarea
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Justificativa da análise..."
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <Button
                    disabled={loading}
                    onClick={() => doAction("APROVAR_PARA_REVISAO")}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" /> Aprovar para Revisão
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={loading}
                    onClick={() => doAction("RECUSAR")}
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Recusar
                  </Button>
                </div>
              </>
            )}

            {/* REVISOR */}
            {userRole === "REVISOR" && (
              <>
                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={() => doAction("ASSUMIR_REVISAO")}
                >
                  {loading ? "Processando..." : "Assumir Revisão"}
                </Button>

                <div className="space-y-2">
                  <Label>Observações da Revisão</Label>
                  <Textarea
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Observações..."
                  />
                </div>

                <Button
                  className="w-full"
                  disabled={loading}
                  onClick={() => doAction("ENVIAR_PARA_APROVACAO")}
                >
                  Enviar para Aprovação
                </Button>
              </>
            )}

            {/* APROVADOR */}
            {userRole === "APROVADOR" && (
              <>
                <div className="space-y-2">
                  <Label>Justificativa do Voto</Label>
                  <Textarea
                    rows={4}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Justifique seu voto..."
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <Button disabled={loading} onClick={() => doAction("VOTAR_A_FAVOR")}>
                    <CheckCircle className="h-4 w-4 mr-2" /> Votar a Favor
                  </Button>
                  <Button
                    variant="outline"
                    disabled={loading}
                    onClick={() => doAction("VOTAR_CONTRA")}
                  >
                    <XCircle className="h-4 w-4 mr-2" /> Votar Contra
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
