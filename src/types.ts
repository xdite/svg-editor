export interface Element {
  id: string;
  type: 'text' | 'rect' | 'path';
  x?: number;
  y?: number;
  d?: string;
  text?: string;
  fill?: string;
  opacity?: string;
  fontSize?: number;
  transform?: string;
  width?: number;
  height?: number;
}

export interface SVGImportResult {
  elements: Element[];
}