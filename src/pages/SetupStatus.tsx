import { useEffect, useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Alert, AlertDescription } from '../components/ui/alert';
import { checkTablesExist, checkTestUsers, executeSqlScript } from '../lib/api/supabase-setup';
import { Loader2, AlertCircle, CheckCircle, Copy } from 'lucide-react';

const SetupStatus = () => {
  const [loading, setLoading] = useState(true);
  const [tablesStatus, setTablesStatus] = useState<any>(null);
  const [usersStatus, setUsersStatus] = useState<any>(null);
  const [sqlInstructions, setSqlInstructions] = useState('');

  useEffect(() => {
    const checkStatus = async () => {
      setLoading(true);
      
      // 테이블 존재 여부 확인
      const tablesResult = await checkTablesExist();
      setTablesStatus(tablesResult);
      
      // 테이블이 존재한다면 테스트 사용자 확인
      if (tablesResult.success) {
        const usersResult = await checkTestUsers();
        setUsersStatus(usersResult);
      }
      
      // SQL 실행 안내 메시지
      const instructions = executeSqlScript();
      setSqlInstructions(instructions);
      
      setLoading(false);
    };
    
    checkStatus();
  }, []);

  const handleCopySql = async () => {
    try {
      const response = await fetch('/src/data/schema.sql');
      const sqlContent = await response.text();
      navigator.clipboard.writeText(sqlContent);
      alert('SQL 스크립트가 클립보드에 복사되었습니다.');
    } catch (error) {
      console.error('SQL 복사 오류:', error);
      alert('SQL 스크립트 복사 중 오류가 발생했습니다.');
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Supabase 설정 상태</h1>
        
        {loading ? (
          <Card>
            <CardContent className="pt-6 flex justify-center items-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
              <span className="ml-2">상태 확인 중...</span>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>테이블 상태</CardTitle>
                <CardDescription>
                  필요한 테이블의 존재 여부를 확인합니다.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tablesStatus?.success ? (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-700">
                      모든 테이블이 존재합니다: {tablesStatus.existingTables.join(', ')}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      다음 테이블이 누락되었습니다: {tablesStatus?.missingTables?.join(', ')}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
            
            {usersStatus && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>테스트 사용자</CardTitle>
                  <CardDescription>
                    샘플 사용자 데이터 확인
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {usersStatus.success && usersStatus.users?.length > 0 ? (
                    <div>
                      <Alert className="bg-green-50 border-green-200 mb-4">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <AlertDescription className="text-green-700">
                          {usersStatus.users.length}명의 사용자가 있습니다.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이메일</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">역할</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {usersStatus.users.map((user: any) => (
                              <tr key={user.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.id.substring(0, 8)}...</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        테스트 사용자 데이터가 없습니다.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            )}
            
            {!tablesStatus?.success && (
              <Card>
                <CardHeader>
                  <CardTitle>SQL 스크립트 실행</CardTitle>
                  <CardDescription>
                    Supabase 대시보드에서 SQL 스크립트를 실행하여 테이블을 생성하세요.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4 text-blue-500" />
                    <AlertDescription className="whitespace-pre-line text-blue-700">
                      {sqlInstructions}
                    </AlertDescription>
                  </Alert>
                  
                  <Button onClick={handleCopySql} className="w-full">
                    <Copy className="mr-2 h-4 w-4" />
                    SQL 스크립트 복사하기
                  </Button>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleRefresh} variant="outline" className="w-full">
                    상태 새로고침
                  </Button>
                </CardFooter>
              </Card>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default SetupStatus;
