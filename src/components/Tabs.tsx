
import { useState } from "react";
import { cn } from "@/lib/utils";

type Tab = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

type TabsProps = {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
};

export const Tabs = ({ tabs, activeTab, onTabChange }: TabsProps) => {
  return (
    <div className="flex items-center justify-center mb-8">
      <div className="inline-flex bg-gray-100 p-1 rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-6 py-2 rounded-md font-medium flex items-center gap-2 transition-all duration-200",
              activeTab === tab.id
                ? "bg-white shadow-md text-puzzle-primary"
                : "text-gray-600 hover:text-puzzle-primary"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};
