import React from 'react';
import DraggablePath from './DraggablePath';
import { Element } from '../../types';

interface CanvasProps {
  elements: Element[];
  selectedTool: string;
  selectedElement: Element | null;
  onSelectElement: (element: Element | null) => void;
  onUpdateElement: (element: Element) => void;
}

const Canvas: React.FC<CanvasProps> = ({
  elements,
  selectedElement,
  onSelectElement,
  onUpdateElement,
}) => {
  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onSelectElement(null);
    }
  };

  return (
    <div 
      className="flex-1 bg-gray-50 p-4 overflow-auto"
      onClick={handleCanvasClick}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 960 540"
        className="bg-white shadow-inner"
      >
        {elements.map((element) => {
          switch (element.type) {
            case 'text':
              return (
                <text
                  key={element.id}
                  onClick={() => onSelectElement(element)}
                  style={{ cursor: 'pointer' }}
                  className={selectedElement?.id === element.id ? 'outline outline-2 outline-blue-500' : ''}
                  x={element.x}
                  y={element.y}
                  fill={element.fill}
                  fontSize={element.fontSize}
                  opacity={element.opacity}
                  transform={element.transform}
                >
                  {element.text}
                </text>
              );
            case 'rect':
              return (
                <rect
                  key={element.id}
                  onClick={() => onSelectElement(element)}
                  style={{ cursor: 'pointer' }}
                  className={selectedElement?.id === element.id ? 'outline outline-2 outline-blue-500' : ''}
                  x={element.x}
                  y={element.y}
                  width={element.width}
                  height={element.height}
                  fill={element.fill}
                  opacity={element.opacity}
                  transform={element.transform}
                />
              );
            case 'path':
              return (
                <DraggablePath
                  key={element.id}
                  element={element}
                  isSelected={selectedElement?.id === element.id}
                  onSelect={onSelectElement}
                  onUpdate={onUpdateElement}
                />
              );
            default:
              return null;
          }
        })}
      </svg>
    </div>
  );
};

export default Canvas; 