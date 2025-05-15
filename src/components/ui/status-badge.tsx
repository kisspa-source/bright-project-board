
import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ProjectStatus } from "@/types";

interface StatusBadgeProps {
  status: ProjectStatus;
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = (status: ProjectStatus) => {
    switch (status) {
      case "planning":
        return {
          label: "기획 중",
          color: "bg-blue-100 text-blue-800 hover:bg-blue-100",
        };
      case "design":
        return {
          label: "설계 중",
          color: "bg-purple-100 text-purple-800 hover:bg-purple-100",
        };
      case "development":
        return {
          label: "개발 중",
          color: "bg-amber-100 text-amber-800 hover:bg-amber-100",
        };
      case "testing":
        return {
          label: "테스트 중",
          color: "bg-cyan-100 text-cyan-800 hover:bg-cyan-100",
        };
      case "completed":
        return {
          label: "완료",
          color: "bg-green-100 text-green-800 hover:bg-green-100",
        };
      case "onhold":
        return {
          label: "보류",
          color: "bg-gray-100 text-gray-800 hover:bg-gray-100",
        };
      default:
        return {
          label: status,
          color: "bg-gray-100 text-gray-800 hover:bg-gray-100",
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge
      variant="outline"
      className={cn(config.color, "font-medium border-0", className)}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
