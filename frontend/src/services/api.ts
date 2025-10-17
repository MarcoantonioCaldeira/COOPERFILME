import axios, { type AxiosResponse } from 'axios';
import type { UsuarioDTO, UsuarioRespostaDTO, LoginDTO, AutenticacaoDTO, RoteiroDTO, 
RoteiroResponse, AnaliseDTO, RevisaoDTO, VotoDTO } from './types';


const api = axios.create({
  baseURL: 'http://localhost:5050/',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export interface ApiResponse<T> {
  message: string;
  data: T;
  timestamp: string;
}

export const authService = {
  login: async (credentials: AutenticacaoDTO): Promise<LoginDTO> => {
    const response: AxiosResponse<LoginDTO> = await api.post('/usuarios/login', credentials);
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  getCurrentUser: (): UsuarioRespostaDTO | null => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  hasRole: (role: string): boolean => {
    const user = authService.getCurrentUser();
    return user?.cargo === role;
  }
};

export const usuarioService = {
  criar: async (usuario: UsuarioDTO): Promise<UsuarioRespostaDTO> => {
    const response: AxiosResponse<UsuarioRespostaDTO> = await api.post('/usuarios/cadatrar', usuario);
    return response.data;
  },

  listar: async (id: number): Promise<UsuarioRespostaDTO> => {
    const response: AxiosResponse<UsuarioRespostaDTO> = await api.get(`/usuarios/listar/${id}`);
    return response.data;
  },
};

export const clientePublicService = {
  enviar: async (roteiro: RoteiroDTO): Promise<RoteiroResponse> => {
    const response: AxiosResponse<RoteiroResponse> = await api.post('/roteiros/enviar', roteiro);
    return response.data;
  },

  consultarRoteiro: async (id: number, emailCliente: string): Promise<RoteiroResponse> => {
    const response: AxiosResponse<RoteiroResponse> = await api.get(`/clientes/email/${emailCliente}`);
    return response.data;
  }
};

export const roteiroService = {
  assumirAnalise: async (roteiroId: number, usuarioId: number): Promise<RoteiroResponse> => {
    const response: AxiosResponse<RoteiroResponse> = await api.put(`/roteiros/assumir-analise/${roteiroId}/${usuarioId}`);
    return response.data;
  },

  analisar: async (roteiroId: number, usuarioId: number, analise: AnaliseDTO): Promise<RoteiroResponse> => {
    const response: AxiosResponse<RoteiroResponse> = await api.put(`/roteiros/analisar/${roteiroId}?usuarioId=${usuarioId}`, analise);
    return response.data;
  },

  assumirRevisao: async (roteiroId: number, usuarioId: number): Promise<RoteiroResponse> => {
    const response: AxiosResponse<RoteiroResponse> = await api.put(`/roteiros/assumir-revisao/${roteiroId}/${usuarioId}`);
    return response.data;
  },

  revisar: async (roteiroId: number, usuarioId: number, revisao: RevisaoDTO): Promise<RoteiroResponse> => {
    const response: AxiosResponse<RoteiroResponse> = await api.put(`/roteiros/revisar/${roteiroId}?usuarioId=${usuarioId}`, revisao);
    return response.data;
  },

  votar: async (roteiroId: number, usuarioId: number, voto: VotoDTO): Promise<RoteiroResponse> => {
    const response: AxiosResponse<RoteiroResponse> = await api.post(`/roteiros/votar/${roteiroId}?usuarioId=${usuarioId}`, voto);
    return response.data;
  }
};

export default api;