import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Type, Square, PenTool } from 'lucide-react';
import { Element } from '../../types';
import PathPreview from './PathPreview';
import ElementProperties from './ElementProperties';

interface PropertyPanelProps {
  elements: Element[];
  selectedElement: Element | null;
  onSelectElement: (element: Element | null) => void;
  onUpdateElement: (element: Element) => void;
  onDeleteElement?: (elementId: string) => void;
}

interface GroupedElements {
  [key: string]: {
    icon: React.ReactNode;
    elements: Element[];
  };
}

const PropertyPanel: React.FC<PropertyPanelProps> = ({
  elements,
  selectedElement,
  onSelectElement,
  onUpdateElement,
  onDeleteElement,
}) => {
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({
    'Text Elements': true,
    'Shapes': true,
  });

  const getElementIcon = (type: string) => {
    switch (type) {
      case 'text':
        return <Type className="w-4 h-4" />;
      case 'rect':
        return <Square className="w-4 h-4" />;
      case 'path':
        return <PenTool className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getElementPreview = (element: Element) => {
    switch (element.type) {
      case 'text':
        return (
          <span style={{ color: element.fill || '#000000' }}>
            {element.text?.substring(0, 20) + (element.text && element.text.length > 20 ? '...' : '')}
          </span>
        );
      case 'rect':
        return `Rectangle (${element.width}×${element.height})`;
      default:
        return element.type;
    }
  };

  const groupElements = (elements: Element[]): GroupedElements => {
    return elements.reduce((groups: GroupedElements, element) => {
      if (element.type === 'path') return groups;
      
      let groupName: string;
      switch (element.type) {
        case 'text':
          groupName = 'Text Elements';
          break;
        case 'rect':
          groupName = 'Shapes';
          break;
        default:
          groupName = 'Other';
      }

      if (!groups[groupName]) {
        groups[groupName] = {
          icon: getElementIcon(element.type),
          elements: [],
        };
      }
      groups[groupName].elements.push(element);
      return groups;
    }, {});
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName],
    }));
  };

  const pathElements = elements.filter(el => el.type === 'path');
  const groupedElements = groupElements(elements);

  return (
    <div className="w-96 bg-white rounded-lg shadow-lg flex flex-col h-[calc(100vh-8rem)] overflow-hidden">
      <div className="flex-1 overflow-y-auto p-4">
        {pathElements.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <PenTool className="w-4 h-4" />
              Paths
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {pathElements.map((element) => (
                <div key={element.id} className="space-y-2">
                  <ElementProperties
                    element={element}
                    onUpdateElement={onUpdateElement}
                    onDeleteElement={onDeleteElement}
                  >
                    <div onClick={() => onSelectElement(element)}>
                      <PathPreview
                        element={element}
                        isSelected={selectedElement?.id === element.id}
                        onClick={() => {}}
                      />
                    </div>
                  </ElementProperties>
                </div>
              ))}
            </div>
          </div>
        )}

        {Object.entries(groupedElements).map(([groupName, group]) => (
          <div key={groupName} className="mb-4 last:mb-0">
            <button
              className="w-full flex items-center gap-2 px-2 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => toggleGroup(groupName)}
            >
              {expandedGroups[groupName] ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <span className="flex items-center gap-2">
                {group.icon}
                {groupName} ({group.elements.length})
              </span>
            </button>
            
            {expandedGroups[groupName] && (
              <div className="ml-6 space-y-2 mt-2">
                {group.elements.map((element) => (
                  <div key={element.id} className="space-y-1">
                    <ElementProperties
                      element={element}
                      onUpdateElement={onUpdateElement}
                      onDeleteElement={onDeleteElement}
                    >
                      <div onClick={() => onSelectElement(element)}>
                        <button
                          type="button"
                          className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 hover:bg-gray-50 ${
                            selectedElement?.id === element.id ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                          }`}
                        >
                          <div 
                            className="w-4 h-4 rounded-full border border-gray-200 flex-shrink-0"
                            style={{ 
                              backgroundColor: element.fill || '#000000',
                              opacity: element.opacity || 1
                            }}
                          />
                          <span className="flex-1 text-sm truncate" style={
                            element.type === 'text' 
                              ? { color: element.fill || '#000000', opacity: element.opacity || 1 } 
                              : undefined
                          }>
                            {getElementPreview(element)}
                          </span>
                        </button>
                      </div>
                    </ElementProperties>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyPanel;