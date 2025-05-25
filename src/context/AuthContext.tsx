import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { User } from '../lib/api/users';

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 로컬 스토리지에서 토큰 확인
    const storedToken = localStorage.getItem('pms_token');
    const storedUser = localStorage.getItem('pms_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  // 로그인 함수
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      // Supabase에서 사용자 조회
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single();
      
      if (error || !data) {
        throw new Error('로그인 실패: 사용자를 찾을 수 없습니다.');
      }
      
      // 실제 애플리케이션에서는 비밀번호 해싱 및 비교 로직이 필요함
      // 여기서는 간단한 예시로 직접 비교
      if (data.password !== password) {
        throw new Error('로그인 실패: 비밀번호가 일치하지 않습니다.');
      }
      
      // JWT 토큰 생성 (실제로는 서버에서 생성해야 함)
      // 이 예시에서는 임시로 간단한 토큰 생성
      const mockToken = btoa(`${data.id}:${data.email}:${Date.now()}`);
      
      // 사용자 정보 및 토큰 저장
      setUser(data);
      setToken(mockToken);
      setIsAuthenticated(true);
      
      // 로컬 스토리지에 저장
      localStorage.setItem('pms_token', mockToken);
      localStorage.setItem('pms_user', JSON.stringify(data));
    } catch (error) {
      console.error('로그인 오류:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    setIsLoading(true);
    
    try {
      // 상태 초기화
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      
      // 로컬 스토리지에서 제거
      localStorage.removeItem('pms_token');
      localStorage.removeItem('pms_user');
    } catch (error) {
      console.error('로그아웃 오류:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 인증 상태 확인
  const checkAuth = async () => {
    if (token && user) {
      return true;
    }
    return false;
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내부에서만 사용할 수 있습니다.');
  }
  return context;
};
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { currentUser } from '../data/mockData';
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = localStorage.getItem('pms-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // In a real app, this would be an API call
      // For now, we'll just use our mock data
      if (email === currentUser.email && password === 'password') {
        setUser(currentUser);
        setIsAuthenticated(true);
        localStorage.setItem('pms-user', JSON.stringify(currentUser));
        toast.success("로그인 되었습니다.");
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      toast.error("이메일 또는 비밀번호가 잘못되었습니다.");
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('pms-user');
    toast.info("로그아웃 되었습니다.");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
