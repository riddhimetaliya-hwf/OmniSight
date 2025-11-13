
import React from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="w-full animate-fade-in">
      <div className="flex items-center">
        <h1 className="text-2xl font-medium">{title}</h1>
        {subtitle && (
          <div className="ml-3 bg-apple-blue/10 text-apple-blue rounded-full px-2.5 py-0.5 text-xs font-medium">
            {subtitle}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
