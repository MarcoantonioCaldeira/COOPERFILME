import { useState } from "react";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { LinhaDoTempoStatus } from "./LinhaDoTempoStatus";
import { clientePublicService } from "../services/api";

interface CheckStatusProps {
  onBack: () => void;
}

export function ChecarStatus({ onBack }: CheckStatusProps) {
  const [searchValue, setSearchValue] = useState("");
  const [script, setScript] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchValue.trim()) return;

    setLoading(true);
    setError(null);
    setScript(null);

    try {
      const result = await clientePublicService.consultarRoteiro(0, searchValue.trim());
      setScript(result);
    } catch (err: any) {
      console.error("Erro ao buscar roteiro:", err);
      setError("Roteiro não encontrado. Verifique o e-mail digitado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="max-w-4xl mx-auto pt-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Consultar Status do Roteiro</CardTitle>
            <CardDescription>
              Digite o ID do roteiro ou seu e-mail para consultar o status
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="search">ID do Roteiro ou E-mail</Label>
                  <Input
                    id="search"
                    placeholder="ROT-001 ou seu@email.com"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" disabled={loading}>
                    <Search className="h-4 w-4 mr-2" />
                    {loading ? "Consultando..." : "Consultar"}
                  </Button>
                </div>
              </div>
            </form>

            {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          </CardContent>
        </Card>

        {script && (
          <Card>
            <CardHeader>
              <CardTitle>{script.titulo}</CardTitle>
              <CardDescription>ID: {script.id}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Detalhes */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Autor</p>
                    <p>{script.nome}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">E-mail</p>
                    <p>{script.email}</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Responsável Atual</p>
                    <p>{script.usuarioResponsavel?.nome || "Aguardando atribuição"}</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="mb-4">Status do Roteiro</h4>
                <LinhaDoTempoStatus currentStatus={script.status} />
              </div>

              {/* Observações */}
              {script.observacoes && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Observações</p>
                  <p className="text-gray-800">{script.observacoes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}