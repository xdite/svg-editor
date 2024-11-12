import React from 'react';
import { Trash2, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import * as Popover from '@radix-ui/react-popover';
import { Element } from '../../types';

interface ElementPropertiesProps {
  element: Element;
  onUpdateElement: (element: Element) => void;
  onDeleteElement?: (elementId: string) => void;
  children: React.ReactNode;
}

const ElementProperties: React.FC<ElementPropertiesProps> = ({
  element,
  onUpdateElement,
  onDeleteElement,
  children,
}) => {
  const handleChange = (property: string, value: string | number) => {
    onUpdateElement({
      ...element,
      [property]: value,
    });
  };

  const moveElement = (direction: 'up' | 'down' | 'left' | 'right') => {
    const currentX = element.x || 0;
    const currentY = element.y || 0;
    const step = 1;

    let newX = currentX;
    let newY = currentY;

    switch (direction) {
      case 'up':
        newY -= step;
        break;
      case 'down':
        newY += step;
        break;
      case 'left':
        newX -= step;
        break;
      case 'right':
        newX += step;
        break;
    }

    onUpdateElement({
      ...element,
      x: newX,
      y: newY,
      transform: `translate(${newX} ${newY})`,
    });
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        {children}
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="z-50 w-72 rounded-lg shadow-lg bg-white border border-gray-200 animate-in zoom-in-95"
          sideOffset={5}
          align="start"
        >
          <div className="space-y-3 p-3">
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

            {element.type === 'path' && (
              <div className="space-y-2">
                <span className="text-xs text-gray-500">Position</span>
                <div className="grid grid-cols-3 gap-1 w-32 mx-auto">
                  <div className="col-start-2">
                    <button
                      onClick={() => moveElement('up')}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                      type="button"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="col-start-1 col-end-4 flex justify-between">
                    <button
                      onClick={() => moveElement('left')}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                      type="button"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => moveElement('right')}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                      type="button"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="col-start-2">
                    <button
                      onClick={() => moveElement('down')}
                      className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100"
                      type="button"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-2 text-xs text-gray-500">
                  <span>X: {element.x || 0}px</span>
                  <span>Y: {element.y || 0}px</span>
                </div>
              </div>
            )}

            {element.type === 'text' && (
              <>
                <div>
                  <input
                    type="text"
                    value={element.text || ''}
                    onChange={(e) => handleChange('text', e.target.value)}
                    className="w-full px-2 py-1 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div className="flex gap-2 items-center">
                  <span className="text-xs text-gray-500">Color</span>
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
              </>
            )}

            {element.type !== 'text' && (
              <div className="flex gap-2 items-center">
                <span className="text-xs text-gray-500">Fill</span>
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
            )}

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
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default ElementProperties;