import React, { useRef, useEffect, useState } from 'react';
import { Element } from '../../types';

interface PathPreviewProps {
  element: Element;
  isSelected: boolean;
  onClick: () => void;
}

const PathPreview: React.FC<PathPreviewProps> = ({ element, isSelected, onClick }) => {
  const pathRef = useRef<SVGPathElement>(null);
  const [viewBox, setViewBox] = useState("0 0 960 540");

  useEffect(() => {
    if (pathRef.current) {
      const bbox = pathRef.current.getBBox();
      // 添加一些 padding
      const padding = 10;
      const x = bbox.x - padding;
      const y = bbox.y - padding;
      const width = bbox.width + (padding * 2);
      const height = bbox.height + (padding * 2);
      setViewBox(`${x} ${y} ${width} ${height}`);
    }
  }, [element.d]);

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
        viewBox={viewBox}
        preserveAspectRatio="none"
        className="absolute inset-0"
      >
        <path
          ref={pathRef}
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