
import React, { ReactNode } from "react";

interface SectionHeaderProps {
  title: string;
  description: string;
  children?: ReactNode;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  title, 
  description, 
  children 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="max-w-2xl">
        <h2 className="text-xl font-medium mb-2">{title}</h2>
        <p className="text-apple-gray">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
};

export default SectionHeader;
