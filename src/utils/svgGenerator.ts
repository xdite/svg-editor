import { Element } from '../types';

export const generateSVG = (elements: Element[]): string => {
  const generateElementString = (element: Element): string => {
    const commonProps = [
      element.fill ? `fill="${element.fill}"` : '',
      element.opacity ? `opacity="${element.opacity}"` : '',
      element.transform ? `transform="${element.transform}"` : '',
    ].filter(Boolean).join(' ');

    switch (element.type) {
      case 'text':
        return `<text x="${element.x}" y="${element.y}" ${commonProps} font-size="${element.fontSize || 16}">${element.text}</text>`;
      
      case 'rect':
        return `<rect x="${element.x}" y="${element.y}" width="${element.width}" height="${element.height}" ${commonProps} />`;
      
      case 'path':
        return `<path d="${element.d}" ${commonProps} />`;
      
      default:
        return '';
    }
  };

  const svgContent = elements.map(generateElementString).join('\n    ');

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg xmlns="http://www.w3.org/2000/svg" width="960" height="540" viewBox="0 0 960 540">
  <g>
    ${svgContent}
  </g>
</svg>`;
};