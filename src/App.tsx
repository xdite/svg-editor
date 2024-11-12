import React, { useState } from 'react';
import { MousePointer, Upload, Move, Download, Code, Palette } from 'lucide-react';
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
  const [activeTab, setActiveTab] = useState<'visual' | 'code'>('visual');
  const [svgCode, setSvgCode] = useState<string>('');

  const tools = [
    { id: 'select', icon: MousePointer, label: 'Select' },
    { id: 'upload', icon: Upload, label: 'Upload SVG' },
    { id: 'download', icon: Download, label: 'Download SVG' },
    { id: 'code', icon: Code, label: 'Code View' },
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
    } else if (toolId === 'code') {
      if (activeTab === 'visual') {
        setSvgCode(generateSVG(elements));
        setActiveTab('code');
      } else {
        try {
          parseSVG(svgCode).then(result => {
            setElements(result.elements);
            setActiveTab('visual');
          });
        } catch (error) {
          console.error('Invalid SVG code:', error);
        }
      }
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

  const handleCodeChange = (newCode: string) => {
    setSvgCode(newCode);
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
          tools={tools.filter(tool => tool.id !== 'code')}
          selectedTool={selectedTool}
          onSelectTool={handleToolSelect}
        />

        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-lg min-h-[600px]">
          <div className="flex border-b border-gray-200">
            <button
              className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'visual'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                if (activeTab === 'code') {
                  try {
                    parseSVG(svgCode).then(result => {
                      setElements(result.elements);
                      setActiveTab('visual');
                    });
                  } catch (error) {
                    console.error('Invalid SVG code:', error);
                  }
                }
              }}
              title="Visual Editor"
            >
              <Palette className="w-4 h-4" />
            </button>
            <button
              className={`px-4 py-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === 'code'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setSvgCode(generateSVG(elements));
                setActiveTab('code');
              }}
              title="Source Code"
            >
              <Code className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1">
            {activeTab === 'visual' ? (
              <Canvas
                key="visual-canvas"
                elements={elements}
                selectedTool={selectedTool}
                selectedElement={selectedElement}
                onSelectElement={setSelectedElement}
                onUpdateElement={handleUpdateElement}
              />
            ) : (
              <div className="w-full h-full p-4">
                <textarea
                  value={svgCode}
                  onChange={(e) => handleCodeChange(e.target.value)}
                  className="w-full h-full font-mono text-sm p-4 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  spellCheck={false}
                />
              </div>
            )}
          </div>
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