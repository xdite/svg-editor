export interface Element {
  id: string;
  type: 'text' | 'rect' | 'path';
  fill?: string;
  opacity?: string;
  text?: string;
  fontSize?: number;
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  d?: string;
  transform?: string;
}

export interface SVGImportResult {
  elements: Element[];
}