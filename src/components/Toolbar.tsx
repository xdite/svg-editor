import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Tool {
  id: string;
  icon: LucideIcon;
  label: string;
}

interface ToolbarProps {
  tools: Tool[];
  selectedTool: string;
  onSelectTool: (toolId: string) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ tools, selectedTool, onSelectTool }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-2 h-fit">
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.id}
            className={`w-10 h-10 flex items-center justify-center rounded-lg mb-2 last:mb-0 ${
              selectedTool === tool.id
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => onSelectTool(tool.id)}
            title={tool.label}
          >
            <Icon className="w-5 h-5" />
          </button>
        );
      })}
    </div>
  );
};

export default Toolbar;