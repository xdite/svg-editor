import React from 'react';
import { Trash2 } from 'lucide-react';
import { Element } from '../../types';

interface ElementPropertiesProps {
  element: Element;
  onUpdateElement: (element: Element) => void;
  onDeleteElement?: (elementId: string) => void;
}

const ElementProperties: React.FC<ElementPropertiesProps> = ({
  element,
  onUpdateElement,
  onDeleteElement,
}) => {
  const handleChange = (property: string, value: string | number) => {
    onUpdateElement({
      ...element,
      [property]: value,
    });
  };

  return (
    <div className="space-y-3 p-3 bg-gray-50 rounded-md">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">
          {element.type === 'path' ? 'Path Properties' : 'Element Properties'}
        </span>
        <button
          onClick={() => onDeleteElement?.(element.id)}
          className="p-1 text-red-600 hover:bg-red-50 rounded-md"
          title="Delete element"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {element.type === 'text' && (
        <div>
          <input
            type="text"
            value={element.text || ''}
            onChange={(e) => handleChange('text', e.target.value)}
            className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      )}

      <div className="flex gap-2 items-center">
        <input
          type="color"
          value={element.fill || '#000000'}
          onChange={(e) => handleChange('fill', e.target.value)}
          className="w-6 h-6 p-0 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          value={element.fill || '#000000'}
          onChange={(e) => handleChange('fill', e.target.value)}
          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {element.type === 'text' && (
        <div className="flex gap-2 items-center">
          <span className="text-xs text-gray-500">Size</span>
          <input
            type="number"
            value={element.fontSize || 16}
            onChange={(e) => handleChange('fontSize', Number(e.target.value))}
            className="w-20 px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      )}

      <div className="flex gap-2 items-center">
        <span className="text-xs text-gray-500">Opacity</span>
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={element.opacity || "1"}
          onChange={(e) => handleChange('opacity', e.target.value)}
          className="flex-1"
        />
        <span className="text-xs text-gray-500 w-8">
          {Math.round((parseFloat(element.opacity || "1") * 100))}%
        </span>
      </div>
    </div>
  );
};

export default ElementProperties;