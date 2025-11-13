
import React from "react";

const ThinkingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start">
      <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-3 max-w-[80%]">
        <div className="flex space-x-2">
          <div className="animate-bounce h-2 w-2 bg-gray-500 rounded-full"></div>
          <div className="animate-bounce h-2 w-2 bg-gray-500 rounded-full" style={{ animationDelay: "0.2s" }}></div>
          <div className="animate-bounce h-2 w-2 bg-gray-500 rounded-full" style={{ animationDelay: "0.4s" }}></div>
        </div>
      </div>
    </div>
  );
};

export default ThinkingIndicator;
