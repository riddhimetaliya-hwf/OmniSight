import React from "react";

interface NavFooterProps {
  environment: "development" | "staging" | "production" | "demo";
}

const NavFooter: React.FC<NavFooterProps> = ({ environment }) => {
  const getEnvironmentStyles = () => {
    switch (environment) {
      case "development":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
      case "staging":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300";
      case "production":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300";
      case "demo":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800/40 dark:text-gray-300";
    }
  };

  return null;
};

export default NavFooter;
