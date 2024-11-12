import { Element, SVGImportResult } from '../types';

export const parseSVG = async (svgContent: string): Promise<SVGImportResult> => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgContent, 'image/svg+xml');
  const elements: Element[] = [];

  // Helper function to generate unique IDs
  const generateId = () => Math.random().toString(36).substr(2, 9);

  // Helper function to get transform matrix
  const getTransform = (element: SVGElement) => {
    const transform = element.getAttribute('transform');
    if (!transform) return '';
    return transform;
  };

  // Parse all elements including nested ones
  const parseElement = (element: Element, parentTransform: string = '') => {
    const transform = getTransform(element as unknown as SVGElement);
    const fullTransform = parentTransform + ' ' + transform;

    switch (element.tagName.toLowerCase()) {
      case 'text':
        const textElement = element as SVGTextElement;
        const tspans = Array.from(textElement.querySelectorAll('tspan'));
        const textContent = tspans.length > 0 
          ? tspans.map(tspan => tspan.textContent).join(' ')
          : textElement.textContent;

        elements.push({
          id: generateId(),
          type: 'text',
          text: textContent || '',
          x: parseFloat(textElement.getAttribute('x') || '0'),
          y: parseFloat(textElement.getAttribute('y') || '0'),
          fill: textElement.getAttribute('fill') || '#000000',
          fontSize: parseFloat(textElement.getAttribute('font-size') || '16'),
          opacity: textElement.getAttribute('opacity') || '1',
          transform: fullTransform.trim() || undefined,
        });
        break;

      case 'rect':
        elements.push({
          id: generateId(),
          type: 'rect',
          x: parseFloat(element.getAttribute('x') || '0'),
          y: parseFloat(element.getAttribute('y') || '0'),
          width: parseFloat(element.getAttribute('width') || '0'),
          height: parseFloat(element.getAttribute('height') || '0'),
          fill: element.getAttribute('fill') || '#000000',
          opacity: element.getAttribute('opacity') || '1',
          transform: fullTransform.trim() || undefined,
        });
        break;

      case 'path':
        elements.push({
          id: generateId(),
          type: 'path',
          d: element.getAttribute('d') || '',
          fill: element.getAttribute('fill') || '#000000',
          opacity: element.getAttribute('opacity') || '1',
          transform: fullTransform.trim() || undefined,
        });
        break;

      case 'g':
        // Process all children of group with accumulated transform
        Array.from(element.children).forEach(child => {
          parseElement(child as Element, fullTransform);
        });
        break;
    }
  };

  // Start parsing from all direct children of the SVG
  const svgElement = doc.querySelector('svg');
  if (svgElement) {
    Array.from(svgElement.children).forEach(child => {
      parseElement(child as Element);
    });
  }

  return { elements };
};