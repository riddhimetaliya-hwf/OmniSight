
import React from "react";

const SearchFilterBar: React.FC = () => {
  return (
    <div className="flex items-center space-x-4 mt-4 md:mt-0">
      <div className="relative">
        <input
          type="text"
          placeholder="Search integrations..."
          className="pl-9 pr-4 py-2 border border-gray-200 rounded-apple-sm 
                     focus:ring-apple-blue focus:border-apple-blue text-sm w-full md:w-auto"
        />
        <svg
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-apple-gray"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
      </div>
      
      <select 
        className="border border-gray-200 rounded-apple-sm py-2 pl-3 pr-8 text-sm
                   focus:ring-apple-blue focus:border-apple-blue appearance-none bg-white"
        defaultValue="all"
      >
        <option value="all">All systems</option>
        <option value="erp">ERP</option>
        <option value="crm">CRM</option>
        <option value="communication">Communication</option>
        <option value="storage">File Storage</option>
      </select>
    </div>
  );
};

export default SearchFilterBar;
