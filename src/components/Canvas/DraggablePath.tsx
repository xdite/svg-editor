import React, { useState, useEffect } from 'react';
import { Element } from '../../types';

interface DraggablePathProps {
  element: Element;
  isSelected: boolean;
  onSelect: (element: Element) => void;
  onUpdate: (element: Element) => void;
}

const DraggablePath: React.FC<DraggablePathProps> = ({
  element,
  isSelected,
  onSelect,
  onUpdate,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (element.x === undefined || element.y === undefined) {
      onUpdate({
        ...element,
        x: 0,
        y: 0,
        transform: 'translate(0 0)',
      });
    }
  }, [element.id]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;

      onUpdate({
        ...element,
        x: newX,
        y: newY,
        transform: `translate(${newX} ${newY})`,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragStart, element, onUpdate]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element);
    setIsDragging(true);
    setDragStart({
      x: e.clientX - (element.x || 0),
      y: e.clientY - (element.y || 0),
    });
  };

  return (
    <path
      data-id={element.id}
      d={element.d}
      fill={element.fill || '#000000'}
      opacity={element.opacity || 1}
      transform={element.transform || 'translate(0 0)'}
      onMouseDown={handleMouseDown}
      style={{
        cursor: isDragging ? 'grabbing' : 'grab',
        outline: isSelected ? '2px solid #3b82f6' : 'none',
        outlineOffset: '2px',
      }}
    />
  );
};

export default DraggablePath; 