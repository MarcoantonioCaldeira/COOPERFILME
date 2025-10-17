export interface UsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  cargo: 'ANALISTA' | 'REVISOR' | 'APROVADOR';
}

export interface UsuarioRespostaDTO {
  id: number;
  nome: string;
  email: string;
  cargo: string;
}

export interface AutenticacaoDTO {
  email: string;
  senha: string;
}

export interface LoginDTO {
  token: string;
  message: string;
  usuario: UsuarioRespostaDTO;
}

export interface RoteiroDTO {
  titulo: string;
  conteudo: string;
  clienteNome: string;
  clienteEmail: string;
  clienteTelefone: string;
}

export interface RoteiroResponse {
  id: number;
  titulo: string;
  status: string;
  dataEnvio: string;
  observacoesAnalise?: string;
  observacoesRevisao?: string;
  cliente: {
    id: number;
    nome: string;
    email: string;
  };
  usuarioResponsavel?: UsuarioRespostaDTO;
}

export interface AnaliseDTO {
  justificativa: string;
  apto: boolean;
}

export interface RevisaoDTO {
  observacoes: string;
}

export interface VotoDTO {
  aprovado: boolean;
  justificativa: string;
}