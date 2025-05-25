import { supabase } from '../supabase';
import { Tables, Insertable, Updateable } from '../../types/supabase';

export type Project = Tables<'projects'>;
export type NewProject = Insertable<'projects'>;
export type UpdateProject = Updateable<'projects'>;

/**
 * 프로젝트 목록 조회
 */
export const getProjects = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('프로젝트 목록 조회 오류:', error);
    return { data: null, error };
  }
};

/**
 * 프로젝트 상세 조회
 */
export const getProjectById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select(`
        *,
        project_users (
          *,
          users:user_id (
            id,
            email,
            role
          )
        )
      `)
      .eq('id', id)
      .single();
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('프로젝트 상세 조회 오류:', error);
    return { data: null, error };
  }
};

/**
 * 프로젝트 생성
 */
export const createProject = async (project: NewProject) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .insert(project)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('프로젝트 생성 오류:', error);
    return { data: null, error };
  }
};

/**
 * 프로젝트 업데이트
 */
export const updateProject = async (id: string, project: UpdateProject) => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .update(project)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('프로젝트 업데이트 오류:', error);
    return { data: null, error };
  }
};

/**
 * 프로젝트 삭제
 */
export const deleteProject = async (id: string) => {
  try {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);
      
    if (error) {
      throw error;
    }
    
    return { error: null };
  } catch (error) {
    console.error('프로젝트 삭제 오류:', error);
    return { error };
  }
};

/**
 * 프로젝트에 사용자 추가
 */
export const addUserToProject = async (projectId: string, userId: string, role: string) => {
  try {
    const { data, error } = await supabase
      .from('project_users')
      .insert({
        project_id: projectId,
        user_id: userId,
        role
      })
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('프로젝트에 사용자 추가 오류:', error);
    return { data: null, error };
  }
};

/**
 * 프로젝트에서 사용자 제거
 */
export const removeUserFromProject = async (projectId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from('project_users')
      .delete()
      .eq('project_id', projectId)
      .eq('user_id', userId);
      
    if (error) {
      throw error;
    }
    
    return { error: null };
  } catch (error) {
    console.error('프로젝트에서 사용자 제거 오류:', error);
    return { error };
  }
};
