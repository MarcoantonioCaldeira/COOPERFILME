import axios from 'axios';
import type { UsuarioDTO, UsuarioRespostaDTO, LoginDTO, AutenticacaoDTO, RoteiroDTO, 
RoteiroResponse, AnaliseDTO, RevisaoDTO, VotoDTO } from './types';


const api = axios.create({
  baseURL: 'http://localhost:5050',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials: AutenticacaoDTO): Promise<LoginDTO> => {
    const { data } = await api.post<LoginDTO>('/usuarios/login', credentials);

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.usuario));
    
    return data;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  getCurrentUser: (): UsuarioRespostaDTO | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
  isAuthenticated: () => !!localStorage.getItem('token'),
  hasRole: (role: string) => authService.getCurrentUser()?.cargo === role
};

export const usuarioService = {
  criar: async (usuario: UsuarioDTO): Promise<UsuarioRespostaDTO> => {
    const { data } = await api.post<UsuarioRespostaDTO>('/usuarios/cadastrar', usuario);
    return data;
  },

  listar: async (id: number): Promise<UsuarioRespostaDTO> => {
    const { data } = await api.get<UsuarioRespostaDTO>(`/usuarios/listar/${id}`);
    return data;
  },
};

export const clientePublicService = {
  enviar: async (roteiro: RoteiroDTO): Promise<RoteiroResponse> => {
    const { data } = await api.post<RoteiroResponse>('/roteiros/enviar', roteiro);
    return data;
  },
  consultarRoteiro: async (id: number, emailCliente: string): Promise<RoteiroResponse> => {
    const { data } = await api.get<RoteiroResponse>(`/roteiros/${emailCliente}`);
    return data;
  }
};

export const roteiroService = {
  assumirAnalise: async (roteiroId: number, usuarioId: number): Promise<RoteiroResponse> => {
    const { data } = await api.put<RoteiroResponse>(`/roteiros/assumir-analise/${roteiroId}/${usuarioId}`);
    return data;
  },
  analisar: async (roteiroId: number, usuarioId: number, analise: AnaliseDTO): Promise<RoteiroResponse> => {
    const { data } = await api.put<RoteiroResponse>(`/roteiros/analisar/${roteiroId}`, analise, {
      params: { usuarioId }
    });
    return data;
  },
  assumirRevisao: async (roteiroId: number, usuarioId: number): Promise<RoteiroResponse> => {
    const { data } = await api.put<RoteiroResponse>(`/roteiros/assumir-revisao/${roteiroId}/${usuarioId}`);
    return data;
  },
  revisar: async (roteiroId: number, usuarioId: number, revisao: RevisaoDTO): Promise<RoteiroResponse> => {
    const { data } = await api.put<RoteiroResponse>(`/roteiros/revisar/${roteiroId}`, revisao, {
      params: { usuarioId }
    });
    return data;
  },
  votar: async (roteiroId: number, usuarioId: number, voto: VotoDTO): Promise<RoteiroResponse> => {
    const { data } = await api.post<RoteiroResponse>(`/roteiros/votar/${roteiroId}`, voto, {
      params: { usuarioId }
    });
    return data;
  },
  pegarPorId: async (id: number): Promise<RoteiroResponse> => {
    const { data } = await api.get<RoteiroResponse>(`/roteiros/${id}`);
    return data;
  },
  listar: async (): Promise<RoteiroResponse[]> => {
    const { data } = await api.get<RoteiroResponse[]>('/roteiros/listar-todos');
    return data;
  }
};

export default api;