import { Element } from '../types';

export const generateSVG = (elements: Element[]): string => {
  const generateElementString = (element: Element): string => {
    const getTransform = (element: Element) => {
      if (!element.transform) {
        return element.x !== undefined && element.y !== undefined
          ? `transform="translate(${element.x} ${element.y})"` 
          : '';
      }
      return `transform="${element.transform}"`;
    };

    const commonProps = [
      element.fill ? `fill="${element.fill}"` : '',
      element.opacity ? `opacity="${element.opacity}"` : '',
    ].filter(Boolean);

    switch (element.type) {
      case 'text': {
        const textProps = [
          ...commonProps,
          element.fontSize ? `font-size="${element.fontSize}pt"` : '',
          element.x !== undefined ? `x="${element.x}"` : '',
          element.y !== undefined ? `y="${element.y}"` : '',
          getTransform(element),
        ].filter(Boolean).join(' ');

        return `<text ${textProps}>${element.text}</text>`;
      }
      
      case 'rect': {
        const rectProps = [
          ...commonProps,
          element.width ? `width="${element.width}"` : '',
          element.height ? `height="${element.height}"` : '',
          getTransform(element),
        ].filter(Boolean).join(' ');

        return `<rect ${rectProps} />`;
      }
      
      case 'path': {
        const pathProps = [
          ...commonProps,
          `d="${element.d}"`,
          getTransform(element),
        ].filter(Boolean).join(' ');

        return `<path ${pathProps} />`;
      }
      
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