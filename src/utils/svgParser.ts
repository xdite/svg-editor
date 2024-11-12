import { Element, SVGImportResult } from '../types';

export const parseSVG = async (svgContent: string): Promise<SVGImportResult> => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');
  const elements: Element[] = [];

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const parseTransform = (transform: string | null): { x: number, y: number } => {
    if (!transform) return { x: 0, y: 0 };
    
    const matrixMatch = transform.match(/matrix\(([\d.-]+),\s*([\d.-]+),\s*([\d.-]+),\s*([\d.-]+),\s*([\d.-]+),\s*([\d.-]+)\)/);
    if (matrixMatch) {
      return {
        x: parseFloat(matrixMatch[5]),
        y: parseFloat(matrixMatch[6])
      };
    }
    
    const translateMatch = transform.match(/translate\(([-\d.]+)(?:,\s*)?([-\d.]+)?\)/);
    if (translateMatch) {
      return {
        x: parseFloat(translateMatch[1]),
        y: parseFloat(translateMatch[2] || '0')
      };
    }

    return { x: 0, y: 0 };
  };

  const parseElement = (element: Element) => {
    const transform = element.getAttribute('transform');
    const position = parseTransform(transform);

    switch (element.tagName.toLowerCase()) {
      case 'text':
        const textElement = element as SVGTextElement;
        const x = textElement.getAttribute('x');
        const y = textElement.getAttribute('y');
        
        elements.push({
          id: generateId(),
          type: 'text',
          text: textElement.textContent || '',
          x: (x ? parseFloat(x) : 0) + position.x,
          y: (y ? parseFloat(y) : 0) + position.y,
          fill: textElement.getAttribute('fill') || '#000000',
          fontSize: parseFloat(textElement.getAttribute('font-size') || '16'),
          opacity: textElement.getAttribute('opacity') || '1',
          transform: undefined,
        });
        break;

      case 'rect':
        elements.push({
          id: generateId(),
          type: 'rect',
          x: parseFloat(element.getAttribute('x') || position.x.toString()),
          y: parseFloat(element.getAttribute('y') || position.y.toString()),
          width: parseFloat(element.getAttribute('width') || '0'),
          height: parseFloat(element.getAttribute('height') || '0'),
          fill: element.getAttribute('fill') || '#000000',
          opacity: element.getAttribute('opacity') || '1',
          transform: transform || undefined,
        });
        break;

      case 'path':
        elements.push({
          id: generateId(),
          type: 'path',
          d: element.getAttribute('d') || '',
          x: position.x,
          y: position.y,
          fill: element.getAttribute('fill') || '#000000',
          opacity: element.getAttribute('opacity') || '1',
          transform: transform || undefined,
        });
        break;

      case 'g':
        Array.from(element.children).forEach(child => {
          parseGroup(child as Element, transform || '');
        });
        break;
    }
  };

  const parseGroup = (element: Element, parentTransform: string = '') => {
    const currentTransform = element.getAttribute('transform') || '';
    const fullTransform = parentTransform + ' ' + currentTransform;

    if (element.tagName.toLowerCase() === 'g') {
      Array.from(element.children).forEach(child => {
        parseGroup(child as Element, fullTransform.trim());
      });
    } else {
      element.setAttribute('transform', fullTransform.trim());
      parseElement(element);
    }
  };

  const svgElement = doc.querySelector('svg');
  if (svgElement) {
    Array.from(svgElement.children).forEach(child => {
      parseGroup(child as Element);
    });
  }

  return { elements };
};