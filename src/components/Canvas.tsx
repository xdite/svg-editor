import React from 'react';
import { Element } from '../types';

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
}) => {
  return (
    <div className="flex-1 bg-gray-50 p-4 overflow-auto">
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 960 540"
        className="bg-white shadow-inner"
      >
        {elements.map((element) => {
          const isSelected = selectedElement?.id === element.id;
          const commonProps = {
            onClick: () => onSelectElement(element),
            style: { cursor: 'pointer' },
            className: isSelected ? 'outline outline-2 outline-blue-500' : '',
            transform: element.transform,
          };

          switch (element.type) {
            case 'text':
              return (
                <text
                  key={element.id}
                  {...commonProps}
                  x={element.x}
                  y={element.y}
                  fill={element.fill}
                  fontSize={element.fontSize}
                  opacity={element.opacity}
                >
                  {element.text}
                </text>
              );
            case 'rect':
              return (
                <rect
                  key={element.id}
                  {...commonProps}
                  x={element.x}
                  y={element.y}
                  width={element.width}
                  height={element.height}
                  fill={element.fill}
                  opacity={element.opacity}
                />
              );
            case 'path':
              return (
                <path
                  key={element.id}
                  {...commonProps}
                  d={element.d}
                  fill={element.fill}
                  opacity={element.opacity}
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