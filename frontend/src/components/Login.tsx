import { useState } from 'react';
import { Film, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { authService } from '../services/api';

type UserRole = 'analista' | 'revisor' | 'aprovador';

interface LoginProps {
  onLogin: (role: UserRole) => void;
  onBack: () => void;
}

export function Login({ onLogin, onBack }: LoginProps) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
        const response = await authService.login({ 
        email, 
        senha: senha 
        });
        
        console.log('Sucesso ao fazer login', response);
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.usuario));

        onLogin(response.usuario.cargo as UserRole);
        
    } catch (error) {
        console.error('Falha ao fazer login:', error);
        alert('Falha no login. Verifique suas credenciais.');
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
                <Label>E-mail</Label>
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
                <Label>Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  required
                />
              </div>
              
              <Button type="submit" className="w-full">
                Entrar
              </Button>

              <div className="text-center">
                <button 
                  type="button"
                  className="text-sm text-blue-600 hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-gray-600 mt-4">
          Demo: Use qualquer email/senha e selecione o cargo desejado
        </p>
      </div>
    </div>
  );
}
