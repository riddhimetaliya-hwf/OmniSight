import React, { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  action?: ReactNode;
  fullWidth?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  action,
  fullWidth = false
}) => {
  return (
    <>
      {/* Skip link for keyboard navigation - removed as per user request */}
      {/* <a href="#main-content" className="skip-link">Skip to main content</a> */}
      <div className="space-y-8 max-w-full mx-auto px-8">
        <div className="mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{title}</h1>
            {subtitle && (
              <div className="mt-2 text-muted-foreground">{subtitle}</div>
            )}
          </div>
          {action && (
            <div className="ml-auto">
              {action}
            </div>
          )}
        </div>
        <div id="main-content" className="space-y-8">
          {children}
        </div>
      </div>
    </>
  );
};

export default Layout;
