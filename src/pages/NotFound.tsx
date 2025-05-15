
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.error("404 Error: Page not found");
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-7xl font-bold text-pms-primary mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-6">페이지를 찾을 수 없습니다</h2>
      <p className="text-muted-foreground mb-8 max-w-md">
        요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
      </p>
      <Button
        onClick={() => navigate(isAuthenticated ? "/" : "/login")}
        className="px-6"
      >
        {isAuthenticated ? "대시보드로 돌아가기" : "로그인 페이지로 이동"}
      </Button>
    </div>
  );
};

export default NotFound;
