
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { authAPI } from '@/services/api';
import axios from 'axios';

type User = {
  id: string;
  email: string;
  name: string;
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  fitnessGoal: 'lose' | 'maintain' | 'gain';
  workoutFrequency: number;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
};

type RegisterData = {
  email: string;
  password: string;
  name: string;
  weight: number;
  height: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  fitnessGoal: 'lose' | 'maintain' | 'gain';
  workoutFrequency: number;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await authAPI.getProfile();
      
      // Transform the backend user data to frontend user format
      const userData = {
        id: response.data.id,
        email: response.data.email,
        name: response.data.name,
        weight: response.data.weight,
        height: response.data.height,
        age: response.data.age,
        gender: response.data.gender,
        fitnessGoal: response.data.fitness_goal,
        workoutFrequency: response.data.workout_frequency
      };
      
      setUser(userData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
      localStorage.removeItem('token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await authAPI.login(email, password);
      
      // Store tokens
      localStorage.setItem('token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      
      // Fetch user data with the new token
      await fetchUserData();
      
      toast({
        title: "Login bem-sucedido!",
        description: "Bem-vindo ao Shape Shift Genie",
      });
      
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Login error:", error);
        
        let errorMessage = "E-mail ou senha inválidos";
        
        if (error.response?.status === 400) {
          errorMessage = "Dados inválidos. Verifique os campos e tente novamente.";
        } else if (error.response?.status === 401) {
          errorMessage = "Credenciais inválidas. Verifique seu e-mail e senha.";
        }
        
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: errorMessage,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro ao fazer login",
          description: "Ocorreu um erro. Por favor, tente novamente.",
        });
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      
      // Transform frontend user data to backend format
      const backendUserData = {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        username: userData.email.split('@')[0], // Create a username from email
        weight: userData.weight,
        height: userData.height,
        age: userData.age,
        gender: userData.gender,
        fitness_goal: userData.fitnessGoal,
        workout_frequency: userData.workoutFrequency
      };
      
      const response = await authAPI.register(backendUserData);
      
      // Store tokens if they are returned
      if (response.data.access && response.data.refresh) {
        localStorage.setItem('token', response.data.access);
        localStorage.setItem('refresh_token', response.data.refresh);
        
        // Fetch user profile
        await fetchUserData();
      }
      
      toast({
        title: "Registro bem-sucedido!",
        description: "Sua conta foi criada com sucesso",
      });
      
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Registration error:", error);
        
        let errorMessage = "Erro ao registrar. Por favor, tente novamente.";
        
        if (error.response?.data?.email) {
          errorMessage = "Este e-mail já está em uso.";
        } else if (error.response?.data?.username) {
          errorMessage = "Este nome de usuário já está em uso.";
        } else if (error.response?.status === 400) {
          errorMessage = "Dados inválidos. Verifique os campos e tente novamente.";
        }
        
        toast({
          variant: "destructive",
          title: "Erro no registro",
          description: errorMessage,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Erro no registro",
          description: "Ocorreu um erro. Por favor, tente novamente.",
        });
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    toast({
      title: "Desconectado",
      description: "Você foi desconectado com sucesso",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
