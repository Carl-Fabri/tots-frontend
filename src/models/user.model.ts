export interface User {
  id: number;
  name: string;
  email: string;
  role: 'user' | 'admin';
  created_at?: string;
  updated_at?: string;
}

export interface LoginResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface RegisterResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface MeResponse {
  status: string;
  data: {
    user: User;
  };
}

