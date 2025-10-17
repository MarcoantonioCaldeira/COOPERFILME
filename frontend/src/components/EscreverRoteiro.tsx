import { useState } from 'react';
import { Film, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { clientePublicService } from '../services/api';

interface SubmitScriptProps {
  onBack: () => void;
}

export function EscreverRoteiro({ onBack }: SubmitScriptProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    title: '',
    content: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [scriptId, setScriptId] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
   try {
        const response = await clientePublicService.enviar({
        titulo: formData.title,
        conteudo: formData.content,
        clienteNome: formData.fullName,
        clienteEmail: formData.email,
        clienteTelefone: formData.phone
      });
      setScriptId(response.id.toString());
      setSubmitted(true);
      setErrors({});
    } catch (error) {
      console.error('Erro ao enviar roteiro:', error);
      alert('Falha ao enviar roteiro. Tente novamente mais tarde.');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4">
        <div className="max-w-2xl mx-auto pt-8">
          <Button 
            variant="ghost" 
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar à Página Inicial
          </Button>

          <Card className="border-green-200">
            <CardHeader className="text-center space-y-4">
              <div className="flex justify-center">
                <div className="bg-green-100 p-4 rounded-full">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-green-900">Roteiro Enviado com Sucesso!</CardTitle>
              <CardDescription>
                Seu roteiro foi recebido e está aguardando análise
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <Alert>
                <AlertDescription>
                  <div className="space-y-2">
                    <p><strong>ID do Roteiro:</strong> <span className="text-blue-600">{scriptId}</span></p>
                    <p className="text-sm text-gray-600">
                      Guarde este ID para consultar o status do seu roteiro.
                    </p>
                  </div>
                </AlertDescription>
              </Alert>

              <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                <p className="text-sm">
                  <strong>Título:</strong> {formData.title}
                </p>
                <p className="text-sm">
                  <strong>Enviado por:</strong> {formData.fullName}
                </p>
                <p className="text-sm">
                  <strong>E-mail:</strong> {formData.email}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm text-gray-700 mb-2">Próximos Passos:</h4>
                <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                  <li>Seu roteiro será analisado por nossa equipe</li>
                  <li>Você receberá atualizações por e-mail</li>
                  <li>Use o ID fornecido para consultar o status a qualquer momento</li>
                </ol>
              </div>

              <Button 
                onClick={onBack}
                className="w-full"
              >
                Voltar à Página Inicial
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 p-4">
      <div className="max-w-2xl mx-auto pt-8">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Film className="h-5 w-5 text-white" />
              </div>
              <CardTitle>Enviar Roteiro</CardTitle>
            </div>
            <CardDescription>
              Preencha os dados abaixo para submeter seu roteiro para análise
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nome Completo *</Label>
                <Input
                  id="fullName"
                  placeholder="Seu nome completo"
                  value={formData.fullName}
                  onChange={(e) => handleChange('fullName', e.target.value)}
                  className={errors.fullName ? 'border-red-500' : ''}
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-mail *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Telefone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="(00) 00000-0000"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título do Roteiro *</Label>
                <Input
                  id="title"
                  placeholder="O título do seu roteiro"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Conteúdo do Roteiro *</Label>
                <Textarea
                  id="content"
                  placeholder="Cole ou digite o conteúdo completo do seu roteiro aqui..."
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  className={`min-h-[300px] ${errors.content ? 'border-red-500' : ''}`}
                />
                {errors.content && (
                  <p className="text-sm text-red-600">{errors.content}</p>
                )}
              </div>

              <Button type="submit" className="w-full">
                Enviar Roteiro
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
