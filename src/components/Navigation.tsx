import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Home, User, Stethoscope, PlayCircle } from "lucide-react";

const navigationItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/demo-patient", label: "Patient Demo", icon: User },
  { path: "/demo-triage", label: "Triage Demo", icon: Stethoscope },
  { path: "/demo-full", label: "Full Demo", icon: PlayCircle },
];

export const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const currentPage = navigationItems.find(item => item.path === location.pathname);
  const currentLabel = currentPage?.label || "Navigate";
  const CurrentIcon = currentPage?.icon || Home;

  return (
    <div className="fixed top-4 left-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-background/80 backdrop-blur-sm border shadow-lg">
            <CurrentIcon className="w-4 h-4 mr-2" />
            {currentLabel}
            <ChevronDown className="w-4 h-4 ml-2" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-48 bg-background/95 backdrop-blur-sm">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <DropdownMenuItem
                key={item.path}
                onClick={() => navigate(item.path)}
                className={isActive ? "bg-muted font-medium" : ""}
              >
                <Icon className="w-4 h-4 mr-2" />
                {item.label}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};