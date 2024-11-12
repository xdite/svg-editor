import React from 'react';
import { Element } from '../../types';

interface PathPreviewProps {
  element: Element;
  isSelected: boolean;
  onClick: () => void;
}

const PathPreview: React.FC<PathPreviewProps> = ({ element, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-24 h-24 relative rounded-lg overflow-hidden border-2 transition-all
        ${isSelected ? 'border-blue-500 shadow-lg' : 'border-gray-200 hover:border-gray-300'}`}
    >
      <div className="absolute inset-0 bg-gray-50 checkerboard" />
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 960 540"
        preserveAspectRatio="xMidYMid meet"
        className="absolute inset-0"
      >
        <path
          d={element.d}
          fill={element.fill || '#000000'}
          opacity={element.opacity || 1}
          transform={element.transform}
        />
      </svg>
    </button>
  );
};

export default PathPreview;