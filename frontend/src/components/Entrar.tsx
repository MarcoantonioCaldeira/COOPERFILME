import { useState } from 'react';
import { Film, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { authService } from '../services/api';

type FrontRole = 'ANALISTA' | 'REVISOR' | 'APROVADOR';

function mapCargoToFrontRole(cargo: string): FrontRole {
  const enMap: Record<string, FrontRole> = {
    ANALISTA: 'ANALISTA',
    REVISOR: 'REVISOR',
    APROVADOR: 'APROVADOR',
  };
  return (enMap[cargo] ?? 'ANALISTA') as FrontRole;
}

interface LoginProps {
  onLogin: (role: FrontRole) => void;
  onBack: () => void;
  demoMode?: boolean;
}

export function Entrar({ onLogin, onBack, demoMode = false }: LoginProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [role, setRole] = useState<'ANALISTA' | 'REVISOR' | 'APROVADOR'>('ANALISTA');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login({ email, senha });

      if (response?.token) {
        localStorage.setItem("token", response.token);

        onLogin(role);
      } else {
        alert("Token não retornado. Verifique o backend.");
      }
    } catch (error) {
      console.error("Falha ao fazer login:", error);
      alert("Falha no login. Verifique suas credenciais.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card>
          <CardHeader className="space-y-4">
            <div className="flex justify-center">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Film className="h-8 w-8 text-white" />
              </div>
            </div>
            <div className="text-center">
              <CardTitle>COOPERFILME</CardTitle>
              <CardDescription className="mt-2">
                Área Interna - Faça login para continuar
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Cargo (Demo)</Label>
                  <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Selecione o cargo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ANALISTA">Analista</SelectItem>
                      <SelectItem value="REVISOR">Revisor</SelectItem>
                      <SelectItem value="APROVADOR">Aprovador</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500">
                    Em modo demo, o cargo selecionado aqui sobrescreve o cargo vindo do backend.
                  </p>
                </div>
  

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Entrando...' : 'Entrar'}
              </Button>

              <div className="text-center">
                <button type="button" className="text-sm text-blue-600 hover:underline">
                  Esqueci minha senha
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        {demoMode && (
          <p className="text-center text-sm text-gray-600 mt-4">
            Demo: Use qualquer email/senha e selecione o cargo desejado
          </p>
        )}
      </div>
    </div>
  );
}
