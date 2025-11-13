import React, { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  LayoutPanelTop,
  Network,
  Search,
  ArrowLeftFromLine,
  ArrowRightFromLine,
  Bell,
  Activity,
  Zap,
  Lightbulb,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

type NavigationItem = {
  label: string;
  icon: React.ElementType;
  path: string;
  group: string;
  ariaLabel: string;
};

const navigationItems: NavigationItem[] = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
    group: "main",
    ariaLabel: "Go to Dashboard",
  },
  {
    label: "Command Center",
    icon: LayoutPanelTop,
    path: "/command-center",
    group: "main",
    ariaLabel: "Go to Command Center",
  },
  {
    label: "Executive Copilot",
    icon: Sparkles,
    path: "/exec-copilot",
    group: "main",
    ariaLabel: "Go to Executive Copilot",
  },
  {
    label: "Market Intelligence",
    icon: Lightbulb,
    path: "/market-intel",
    group: "performance",
    ariaLabel: "Go to Market Intelligence",
  },
  {
    label: "System Link Map",
    icon: Network,
    path: "/system-link-map",
    group: "tools",
    ariaLabel: "Go to System Link Map",
  },
  {
    label: "Workflow Templates",
    icon: Zap,
    path: "/workflows-template",
    group: "tools",
    ariaLabel: "Go to Workflow Templates",
  },
  {
    label: "Integration Hub",
    icon: Network,
    path: "/integrations",
    group: "tools",
    ariaLabel: "Go to Integration Hub",
  },
  {
    label: "Overview",
    icon: Activity,
    path: "/overview-page",
    group: "tools",
    ariaLabel: "Go to overview page",
  },
];

const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchText, setSearchText] = useState("");
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const currentPath = location.pathname;

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      // Close sidebar on mobile after navigation
      const { setOpen } = useSidebar.getState();
      setOpen(false);
    }
  };

  const filteredItems = searchText
    ? navigationItems.filter((item) =>
        item.label.toLowerCase().includes(searchText.toLowerCase())
      )
    : navigationItems;

  const mainItems = filteredItems.filter((item) => item.group === "main");
  const performanceItems = filteredItems.filter(
    (item) => item.group === "performance"
  );
  const toolsItems = filteredItems.filter((item) => item.group === "tools");
  const integrationItems = filteredItems.filter(
    (item) => item.group === "integrations"
  );

  // Close dropdown if clicked outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    }
    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuOpen]);

  return (
    <SidebarProvider defaultOpen={!isMobile}>
      <div className="h-screen w-full flex overflow-y-auto bg-background">
        <Sidebar className="border-r bg-sidebar flex flex-col justify-between">
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <h1 className="text-xl font-semibold">OmniSight</h1>
            </div>
            <div className="mt-4 px-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  className="pl-9 h-9 bg-sidebar-accent text-sidebar-foreground"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  aria-label="Search navigation"
                />
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2 flex-1 flex flex-col">
            <SidebarGroup>
              <SidebarGroupLabel>Main</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        tooltip={item.label}
                        isActive={currentPath === item.path}
                        onClick={() => handleNavigation(item.path)}
                        aria-label={item.ariaLabel}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Performance</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {performanceItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        tooltip={item.label}
                        isActive={currentPath === item.path}
                        onClick={() => handleNavigation(item.path)}
                        aria-label={item.ariaLabel}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            {/* <SidebarGroup>
              <SidebarGroupLabel>Integrations</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {integrationItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        tooltip={item.label}
                        isActive={currentPath === item.path}
                        onClick={() => handleNavigation(item.path)}
                        aria-label={item.ariaLabel}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup> */}

            <SidebarGroup>
              <SidebarGroupLabel>Workflow</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {toolsItems.map((item) => (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        tooltip={item.label}
                        isActive={currentPath === item.path}
                        onClick={() => handleNavigation(item.path)}
                        aria-label={item.ariaLabel}
                      >
                        <item.icon className="h-5 w-5" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="p-4 pt-0 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => navigate("/alerts")}
                aria-label="Go to Alerts"
              >
                <Bell className="h-4 w-4" />
              </Button>
              <CollapseButton />
            </div>
            <div className="flex-1" />
            <div className="flex flex-col items-start border-t pt-6 pb-2 w-full">
              <div
                ref={profileRef}
                className="flex flex-col items-start w-full relative"
              >
                <button
                  className="flex items-center gap-2 mb-2 w-full justify-start focus:outline-none"
                  onClick={() => setProfileMenuOpen((open) => !open)}
                >
                  <img
                    src="https://ui-avatars.com/api/?name=Alex+Johnson"
                    alt="User Avatar"
                    className="h-8 w-8 rounded-full"
                  />
                  <span className="font-medium">Alex Johnson</span>
                </button>
                {profileMenuOpen && (
                  <div className="absolute bottom-10 left-0 w-48 z-50 flex flex-col bg-card border border-border rounded-xl shadow-2xl animate-[profileDropdown_220ms_cubic-bezier(0.4,0,0.2,1)] origin-top-left">
                    <button
                      className="px-4 py-2 text-left text-foreground hover:bg-accent transition-colors rounded-t-xl"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        navigate("/settings");
                      }}
                    >
                      Profile Settings
                    </button>
                    <button
                      className="px-4 py-2 text-left text-destructive hover:bg-destructive/10 transition-colors rounded-b-xl"
                      onClick={() => {
                        setProfileMenuOpen(
                          false
                        ); /* handle logout logic here */
                      }}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className="flex flex-col h-full overflow-hidden w-full">
          {/* Floating expand button when sidebar is collapsed */}
          <FloatingExpandButton />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

// Collapse button inside the sidebar
const CollapseButton: React.FC = () => {
  const { open, setOpen } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-8 w-8"
      onClick={() => setOpen(!open)}
      aria-label={open ? "Collapse sidebar" : "Expand sidebar"}
    >
      {open ? (
        <ArrowLeftFromLine className="h-4 w-4" />
      ) : (
        <ArrowRightFromLine className="h-4 w-4" />
      )}
    </Button>
  );
};

// Floating button that appears when sidebar is collapsed
const FloatingExpandButton: React.FC = () => {
  const { open, setOpen } = useSidebar();

  // Don't show floating button when sidebar is open
  if (open) return null;

  return (
    <Button
      variant="secondary"
      size="icon"
      className="fixed left-4 top-4 h-8 w-8 z-40 shadow-md"
      onClick={() => setOpen(true)}
      aria-label="Expand sidebar"
    >
      <ArrowRightFromLine className="h-4 w-4" />
    </Button>
  );
};

export default AppShell;
