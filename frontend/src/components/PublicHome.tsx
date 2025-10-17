import { Film, Send, Search } from 'lucide-react';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/card';

interface PublicHomeProps {
  onNavigate: (page: 'submit' | 'check-status' | 'login') => void;
}

export function PublicHome({ onNavigate }: PublicHomeProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
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
                <p className="text-sm text-gray-600">Sistema de Análise de Roteiros</p>
              </div>
            </div>
            <Button 
              variant="outline"
              onClick={() => onNavigate('login')}
            >
              Área Interna
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-gray-900 mb-4">
            Bem-vindo à COOPERFILME
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Envie seu roteiro para análise profissional ou consulte o status de roteiros já enviados.
            Nossa equipe especializada avalia cada projeto com atenção aos detalhes.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Submit Script Card */}
          <Card className="cursor-pointer border-2" onClick={() => onNavigate('submit')}>
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="bg-blue-100 p-4 rounded-full">
                  <Send className="h-10 w-10 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2">Enviar Roteiro</h3>
                  <p className="text-gray-600">
                    Submeta seu roteiro para análise profissional pela nossa equipe de especialistas.
                  </p>
                </div>
                <Button className="w-full mt-4">
                  Começar Envio
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Check Status Card */}
          <Card className="cursor-pointer border-2" onClick={() => onNavigate('check-status')}>
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="bg-green-100 p-4 rounded-full">
                  <Search className="h-10 w-10 text-green-600" />
                </div>
                <div>
                  <h3 className="text-gray-900 mb-2">Consultar Status</h3>
                  <p className="text-gray-600">
                    Acompanhe o progresso da análise do seu roteiro em tempo real.
                  </p>
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Consultar Agora
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Info Section */}
        <div className="mt-16 bg-white rounded-lg p-8 max-w-4xl mx-auto">
          <h3 className="text-gray-900 mb-6 text-center">Como Funciona</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600">1</span>
              </div>
              <p className="text-gray-700">Envio do Roteiro</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600">2</span>
              </div>
              <p className="text-gray-700">Análise Inicial</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600">3</span>
              </div>
              <p className="text-gray-700">Revisão Detalhada</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600">4</span>
              </div>
              <p className="text-gray-700">Aprovação Final</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600">
            © 2025 COOPERFILME. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
