
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === "admin";
  const isMobile = useIsMobile();

  const links = [
    {
      title: "대시보드",
      path: "/",
      icon: <LayoutDashboard className="mr-2 h-5 w-5" />,
    },
    {
      title: "프로젝트",
      path: "/projects",
      icon: <FileText className="mr-2 h-5 w-5" />,
    },
    {
      title: "일정",
      path: "/calendar",
      icon: <Calendar className="mr-2 h-5 w-5" />,
    },
  ];

  // Admin-only links
  const adminLinks = [
    {
      title: "팀 관리",
      path: "/team",
      icon: <Users className="mr-2 h-5 w-5" />,
    },
    {
      title: "설정",
      path: "/settings",
      icon: <Settings className="mr-2 h-5 w-5" />,
    },
  ];

  // Combine links based on role
  const navLinks = isAdmin ? [...links, ...adminLinks] : links;

  return (
    <aside
      className={cn(
        "bg-white border-r border-gray-200 transition-all duration-300 ease-in-out z-30",
        open ? "w-64" : "w-0",
        isMobile && open ? "fixed inset-y-0 left-0" : "",
        isMobile && !open ? "hidden" : ""
      )}
    >
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-bold text-pms-primary">
            {open && "PMS System"}
          </h2>
          {isMobile && open && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="md:hidden"
            >
              <X className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 py-4">
          <ul className="space-y-1 px-2">
            {navLinks.map((link) => (
              <li key={link.path}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-4 py-2.5 rounded-md text-sm font-medium transition-colors",
                      isActive
                        ? "bg-pms-primary text-white"
                        : "text-gray-700 hover:bg-gray-100"
                    )
                  }
                  onClick={isMobile ? onClose : undefined}
                >
                  {link.icon}
                  <span>{link.title}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info Footer */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center">
            <div
              className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-sm font-medium text-gray-600"
              aria-hidden="true"
            >
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500">
                {user?.role === "admin" ? "관리자" : "사용자"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
