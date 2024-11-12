import React, { useState } from 'react';
import { MousePointer, Upload, Move, Download } from 'lucide-react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import PropertyPanel from './components/PropertyPanel';
import { Element, SVGImportResult } from './types';
import { parseSVG } from './utils/svgParser';
import { generateSVG } from './utils/svgGenerator';

function App() {
  const [elements, setElements] = useState<Element[]>([]);
  const [selectedTool, setSelectedTool] = useState<string>('select');
  const [selectedElement, setSelectedElement] = useState<Element | null>(null);

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'upload', icon: Upload, label: 'Upload SVG' },
    { id: 'download', icon: Download, label: 'Download SVG' },
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const svgContent = e.target?.result as string;
      const importResult: SVGImportResult = await parseSVG(svgContent);
      setElements(importResult.elements);
    };
    reader.readAsText(file);
  };

  const handleToolSelect = (toolId: string) => {
    setSelectedTool(toolId);
    if (toolId === 'upload') {
      document.getElementById('svg-upload')?.click();
    } else if (toolId === 'download') {
      handleDownload();
    }
  };

  const handleDownload = () => {
    const svgContent = generateSVG(elements);
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'edited-svg.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleUpdateElement = (updatedElement: Element) => {
    console.log('Updating element:', updatedElement);
    setElements(elements.map(el => 
      el.id === updatedElement.id ? updatedElement : el
    ));
    setSelectedElement(updatedElement);
  };

  const handleDeleteElement = (elementId: string) => {
    setElements(elements.filter(el => el.id !== elementId));
    if (selectedElement?.id === elementId) {
      setSelectedElement(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <Move className="w-6 h-6 text-blue-600" />
          SVG Editor
        </h1>
      </header>

      <div className="flex gap-4 p-6">
        <input
          type="file"
          id="svg-upload"
          accept=".svg"
          className="hidden"
          onChange={handleFileUpload}
        />
        
        <Toolbar
          tools={tools}
          selectedTool={selectedTool}
          onSelectTool={handleToolSelect}
        />

        <div className="flex-1 bg-white rounded-lg shadow-lg min-h-[600px] flex">
          <Canvas
            elements={elements}
            selectedTool={selectedTool}
            selectedElement={selectedElement}
            onSelectElement={setSelectedElement}
            onUpdateElement={handleUpdateElement}
          />
        </div>

        <PropertyPanel
          elements={elements}
          selectedElement={selectedElement}
          onSelectElement={setSelectedElement}
          onUpdateElement={handleUpdateElement}
          onDeleteElement={handleDeleteElement}
        />
      </div>
    </div>
  );
}

export default App;