import { supabase } from '../supabase';

/**
 * Supabase에 연결하여 테이블 존재 여부 확인
 */
export const checkTablesExist = async () => {
  try {
    // 테이블 목록 조회
    const { data: tables, error } = await supabase
      .from('pg_tables')
      .select('tablename')
      .eq('schemaname', 'public');

    if (error) {
      console.error('테이블 목록 조회 오류:', error);
      return { success: false, error };
    }

    // 필요한 테이블 이름 목록
    const requiredTables = ['users', 'projects', 'project_users', 'tasks'];
    
    // 존재하는 테이블 목록
    const existingTables = tables?.map(t => t.tablename) || [];
    
    // 누락된 테이블 목록
    const missingTables = requiredTables.filter(t => !existingTables.includes(t));
    
    return {
      success: missingTables.length === 0,
      existingTables,
      missingTables
    };
  } catch (error) {
    console.error('테이블 확인 중 오류 발생:', error);
    return { success: false, error };
  }
};

/**
 * 테스트 데이터 조회
 */
export const checkTestUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) {
      console.error('사용자 조회 오류:', error);
      return { success: false, error };
    }
    
    return {
      success: true,
      users: data
    };
  } catch (error) {
    console.error('사용자 확인 중 오류 발생:', error);
    return { success: false, error };
  }
};

/**
 * SQL 스크립트 실행 (Supabase 대시보드에서 수동으로 실행해야 함)
 * 
 * 이 함수는 실제로 Supabase에 직접 SQL을 실행하지 않습니다.
 * Supabase 클라이언트는 직접 SQL을 실행할 수 있는 API를 제공하지 않기 때문에
 * Supabase 대시보드에서 직접 SQL 스크립트를 실행해야 합니다.
 */
export const executeSqlScript = () => {
  const message = `
Supabase SQL 스크립트 실행 방법:

1. Supabase 대시보드(https://app.supabase.io)에 로그인합니다.
2. 해당 프로젝트를 선택합니다.
3. 왼쪽 메뉴에서 "SQL Editor"를 클릭합니다.
4. "New query"를 클릭하여 새 쿼리를 생성합니다.
5. src/data/schema.sql 파일의 내용을 복사하여 붙여넣습니다.
6. "Run"을 클릭하여 SQL 스크립트를 실행합니다.
  `;
  
  console.info(message);
  return message;
};
