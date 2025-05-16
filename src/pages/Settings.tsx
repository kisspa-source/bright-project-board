
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@/components/ui/accordion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Settings, Database, Server, SlidersHorizontal, Bell, Mail, Link } from "lucide-react";

const SettingsPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("project");

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const settingsCategories = [
    {
      id: "project",
      label: "프로젝트 설정",
      icon: <Settings className="h-5 w-5" />,
      items: [
        {
          id: "SET-201",
          title: "프로젝트 기본 설정",
          priority: "상(P1)",
          description: "프로젝트 생성 및 관리를 위한 기본 설정을 정의합니다.",
          features: [
            "프로젝트 템플릿 설정",
            "기본 WBS(Work Breakdown Structure) 템플릿 설정",
            "프로젝트 카테고리 관리"
          ]
        },
        {
          id: "SET-202",
          title: "작업(Task) 관리 설정",
          priority: "중(P2)",
          description: "작업 관리를 위한 설정을 정의합니다.",
          features: [
            "작업 상태 정의 (할일/진행/중지/완료)",
            "작업 중요도 설정 (중요/보통/낮음)",
            "작업 할당 방식 설정"
          ]
        },
        {
          id: "SET-203",
          title: "일정 관리 설정",
          priority: "중(P2)",
          description: "프로젝트 일정 관리를 위한 설정을 정의합니다.",
          features: [
            "간트차트 표시 방식 설정 (확대/축소: 월->일, 일->월)",
            "달력 표시 설정",
            "마일스톤 표시 설정"
          ]
        }
      ]
    },
    {
      id: "system",
      label: "시스템 고급 설정",
      icon: <Database className="h-5 w-5" />,
      items: [
        {
          id: "SET-301",
          title: "데이터베이스 설정",
          priority: "중(P2)",
          description: "데이터베이스 연결 및 관리 설정을 정의합니다.",
          features: [
            "데이터베이스 연결 정보 설정",
            "데이터 저장 경로 설정",
            "쿼리 최적화 설정"
          ]
        },
        {
          id: "SET-302",
          title: "시스템 성능 설정",
          priority: "중(P2)",
          description: "시스템 성능 최적화를 위한 설정을 정의합니다.",
          features: [
            "시각 효과(애니메이션) 켜기/끄기",
            "캐시 크기 설정",
            "메모리 사용량 설정"
          ]
        }
      ]
    },
    {
      id: "interface",
      label: "인터페이스 및 시각화 설정",
      icon: <SlidersHorizontal className="h-5 w-5" />,
      items: [
        {
          id: "SET-401",
          title: "UI 커스터마이징",
          priority: "낮음(P3)",
          description: "사용자 인터페이스를 개인화하는 설정을 제공합니다.",
          features: [
            "테마 선택",
            "대시보드 레이아웃 설정",
            "메뉴 표시 설정"
          ]
        },
        {
          id: "SET-402",
          title: "차트 및 보고서 설정",
          priority: "낮음(P3)",
          description: "차트 및 보고서의 표시 방식을 설정합니다.",
          features: [
            "차트 유형 기본값 설정",
            "보고서 템플릿 설정",
            "데이터 표시 형식 설정"
          ]
        }
      ]
    },
    {
      id: "notification",
      label: "알림 및 커뮤니케이션 설정",
      icon: <Bell className="h-5 w-5" />,
      items: [
        {
          id: "SET-501",
          title: "알림 설정",
          priority: "중(P2)",
          description: "시스템 내 알림의 종류와 방식을 설정합니다.",
          features: [
            "알림 종류별 활성화/비활성화",
            "알림음 종류 및 크기 설정",
            "모든 모니터에서 호출 안내창 표시 설정",
            "호출 안내창 팝업 시간 설정"
          ]
        },
        {
          id: "SET-502",
          title: "메시징 설정",
          priority: "중(P2)",
          description: "시스템 내 메시징 기능을 설정합니다.",
          features: [
            "채팅방 기본 설정",
            "메시지 표시 방식 설정",
            "메시지 알림 설정"
          ]
        }
      ]
    },
    {
      id: "integration",
      label: "통합 및 외부 연동 설정",
      icon: <Link className="h-5 w-5" />,
      items: [
        {
          id: "SET-601",
          title: "외부 시스템 연동 설정",
          priority: "중(P2)",
          description: "외부 시스템과의 연동을 위한 설정을 정의합니다.",
          features: [
            "API 연결 정보 설정",
            "HL7 장비 연동 시 검사 결과 소수점 자릿수 설정",
            "데이터 동기화 주기 설정"
          ]
        },
        {
          id: "SET-602",
          title: "이메일 및 알림 연동 설정",
          priority: "낮음(P3)",
          description: "이메일 및 기타 알림 시스템과의 연동을 설정합니다.",
          features: [
            "이메일 서버 설정",
            "알림 템플릿 설정",
            "위험 요소 발생 시 Notification 설정"
          ]
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">설정</h2>
        <p className="text-muted-foreground">
          시스템 및 프로젝트 관련 설정을 관리합니다.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 mb-4">
          {settingsCategories.map(category => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              {category.icon} 
              <span className="hidden md:inline">{category.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {settingsCategories.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  {category.icon}
                  {category.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.items.map((item) => (
                    <AccordionItem key={item.id} value={item.id}>
                      <AccordionTrigger>
                        <div className="flex flex-col items-start text-left">
                          <div className="font-medium">{item.title}</div>
                          <div className="text-xs text-muted-foreground">{item.id} · 우선순위: {item.priority}</div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4">
                          <p>{item.description}</p>
                          <div>
                            <h4 className="font-medium mb-2">세부 기능:</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {item.features.map((feature, index) => (
                                <li key={index} className="text-sm text-muted-foreground">
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default SettingsPage;
