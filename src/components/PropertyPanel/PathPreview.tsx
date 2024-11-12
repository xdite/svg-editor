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
      const padding = 10;
      
      // 計算寬高比
      const aspectRatio = bbox.width / bbox.height;
      
      // 根據寬高比決定如何調整 viewBox
      let width, height;
      if (aspectRatio > 1) {
        // 如果更寬，以寬度為基準
        width = bbox.width + (padding * 2);
        height = width / aspectRatio;
      } else {
        // 如果更高，以高度為基準
        height = bbox.height + (padding * 2);
        width = height * aspectRatio;
      }
      
      const x = bbox.x - ((width - bbox.width) / 2);
      const y = bbox.y - ((height - bbox.height) / 2);
      
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
        preserveAspectRatio="xMidYMid meet"  // 改回 meet 以保持比例
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