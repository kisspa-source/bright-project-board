import { supabase } from '../supabase';
import { Tables, Insertable } from '../../types/supabase';

export type User = Tables<'users'>;
export type NewUser = Insertable<'users'>;

/**
 * 새 사용자 등록
 * @param user 등록할 사용자 정보
 */
export const registerUser = async (user: NewUser) => {
  const { data, error } = await supabase
    .from('users')
    .insert(user)
    .select()
    .single();

  if (error) {
    console.error('사용자 등록 오류:', error);
    throw error;
  }

  return data;
};

/**
 * 이메일로 사용자 조회
 * @param email 조회할 사용자 이메일
 */
export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('email', email)
    .single();

  if (error) {
    console.error('사용자 조회 오류:', error);
    throw error;
  }

  return data;
};

/**
 * 사용자 ID로 사용자 조회
 * @param id 조회할 사용자 ID
 */
export const getUserById = async (id: string) => {
  const { data, error } = await supabase
    .from('users')
    .select()
    .eq('id', id)
    .single();

  if (error) {
    console.error('사용자 조회 오류:', error);
    throw error;
  }

  return data;
};

/**
 * 모든 사용자 목록 조회 (관리자 기능)
 */
export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select();

  if (error) {
    console.error('사용자 목록 조회 오류:', error);
    throw error;
  }

  return data;
};

/**
 * 사용자 정보 업데이트
 * @param id 업데이트할 사용자 ID
 * @param updates 업데이트할 정보
 */
export const updateUser = async (id: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('사용자 업데이트 오류:', error);
    throw error;
  }
import { supabase } from '../supabase';
import { Tables, Insertable, Updateable } from '../../types/supabase';

export type User = Tables<'users'>;
export type NewUser = Insertable<'users'>;
export type UpdateUser = Updateable<'users'>;

/**
 * 사용자 목록 조회
 */
export const getUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, role, created_at')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('사용자 목록 조회 오류:', error);
    return { data: null, error };
  }
};

/**
 * 사용자 상세 조회
 */
export const getUserById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, role, created_at')
      .eq('id', id)
      .single();
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('사용자 상세 조회 오류:', error);
    return { data: null, error };
  }
};

/**
 * 이메일로 사용자 조회
 */
export const getUserByEmail = async (email: string) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('이메일로 사용자 조회 오류:', error);
    return { data: null, error };
  }
};

/**
 * 사용자 역할 업데이트
 */
export const updateUserRole = async (id: string, role: 'USER' | 'ADMIN') => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update({ role })
      .eq('id', id)
      .select('id, email, role, created_at')
      .single();
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('사용자 역할 업데이트 오류:', error);
    return { data: null, error };
  }
};
  return data;
};

/**
 * 사용자 삭제
 * @param id 삭제할 사용자 ID
 */
export const deleteUser = async (id: string) => {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('사용자 삭제 오류:', error);
    throw error;
  }

  return true;
};
