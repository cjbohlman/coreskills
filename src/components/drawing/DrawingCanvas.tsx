import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Button } from '../ui/Button';
import { 
  Square, 
  Circle, 
  ArrowRight, 
  Type, 
  Minus, 
  Trash2, 
  Download, 
  Upload,
  Undo,
  Redo,
  Move
} from 'lucide-react';
import { DrawingElement, CanvasData } from '../../types';

interface DrawingCanvasProps {
  onSave?: (canvasData: CanvasData) => void;
  initialData?: CanvasData;
  readOnly?: boolean;
}

export const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ 
  onSave, 
  initialData,
  readOnly = false 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [elements, setElements] = useState<DrawingElement[]>(initialData?.elements || []);
  const [currentTool, setCurrentTool] = useState<'select' | 'rectangle' | 'circle' | 'arrow' | 'text' | 'line'>('select');
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [history, setHistory] = useState<DrawingElement[][]>([[]]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [textInput, setTextInput] = useState('');
  const [showTextInput, setShowTextInput] = useState(false);
  const [textPosition, setTextPosition] = useState({ x: 0, y: 0 });

  const canvasWidth = 800;
  const canvasHeight = 600;

  const addToHistory = useCallback((newElements: DrawingElement[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newElements]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  }, [history, historyIndex]);

  // Helper function to trigger save
  const triggerSave = useCallback((elementsToSave: DrawingElement[]) => {
    if (onSave) {
      const canvasData: CanvasData = {
        elements: elementsToSave,
        canvasWidth,
        canvasHeight
      };
      console.log('📝 Canvas data saved (this is NOT submission):', canvasData);
      onSave(canvasData);
    }
  }, [onSave]);

  const undo = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (historyIndex > 0) {
      const newElements = [...history[historyIndex - 1]];
      setHistoryIndex(historyIndex - 1);
      setElements(newElements);
      triggerSave(newElements);
    }
  };

  const redo = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (historyIndex < history.length - 1) {
      const newElements = [...history[historyIndex + 1]];
      setHistoryIndex(historyIndex + 1);
      setElements(newElements);
      triggerSave(newElements);
    }
  };

  const drawElement = (ctx: CanvasRenderingContext2D, element: DrawingElement) => {
    ctx.strokeStyle = element.color;
    ctx.fillStyle = element.color;
    ctx.lineWidth = element.strokeWidth;

    switch (element.type) {
      case 'rectangle':
        ctx.strokeRect(element.x, element.y, element.width!, element.height!);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(element.x, element.y, element.radius!, 0, 2 * Math.PI);
        ctx.stroke();
        break;
      case 'arrow':
        drawArrow(ctx, element.startX!, element.startY!, element.endX!, element.endY!);
        break;
      case 'line':
        ctx.beginPath();
        ctx.moveTo(element.startX!, element.startY!);
        ctx.lineTo(element.endX!, element.endY!);
        ctx.stroke();
        break;
      case 'text':
        ctx.font = '16px Inter, sans-serif';
        ctx.fillText(element.text!, element.x, element.y);
        break;
    }

    // Draw selection indicator
    if (selectedElement === element.id && !readOnly) {
      ctx.strokeStyle = '#3B82F6';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      
      const bounds = getElementBounds(element);
      ctx.strokeRect(bounds.x - 5, bounds.y - 5, bounds.width + 10, bounds.height + 10);
      ctx.setLineDash([]);
    }
  };

  const drawArrow = (ctx: CanvasRenderingContext2D, startX: number, startY: number, endX: number, endY: number) => {
    const headLength = 15;
    const angle = Math.atan2(endY - startY, endX - startX);

    // Draw line
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();

    // Draw arrowhead
    ctx.beginPath();
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - headLength * Math.cos(angle - Math.PI / 6),
      endY - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(endX, endY);
    ctx.lineTo(
      endX - headLength * Math.cos(angle + Math.PI / 6),
      endY - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  };

  const getElementBounds = (element: DrawingElement) => {
    switch (element.type) {
      case 'rectangle':
        return {
          x: element.x,
          y: element.y,
          width: element.width!,
          height: element.height!
        };
      case 'circle':
        return {
          x: element.x - element.radius!,
          y: element.y - element.radius!,
          width: element.radius! * 2,
          height: element.radius! * 2
        };
      case 'text':
        return {
          x: element.x,
          y: element.y - 16,
          width: (element.text?.length || 0) * 10,
          height: 20
        };
      case 'arrow':
      case 'line':
        const minX = Math.min(element.startX!, element.endX!);
        const minY = Math.min(element.startY!, element.endY!);
        const maxX = Math.max(element.startX!, element.endX!);
        const maxY = Math.max(element.startY!, element.endY!);
        return {
          x: minX,
          y: minY,
          width: maxX - minX,
          height: maxY - minY
        };
      default:
        return { x: 0, y: 0, width: 0, height: 0 };
    }
  };

  const isPointInElement = (x: number, y: number, element: DrawingElement): boolean => {
    const bounds = getElementBounds(element);
    return x >= bounds.x && x <= bounds.x + bounds.width &&
           y >= bounds.y && y <= bounds.y + bounds.height;
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (readOnly) return;

    const pos = getMousePos(e);
    setStartPos(pos);

    if (currentTool === 'select') {
      // Find element under cursor
      const clickedElement = elements.find(el => isPointInElement(pos.x, pos.y, el));
      if (clickedElement) {
        setSelectedElement(clickedElement.id);
        const bounds = getElementBounds(clickedElement);
        setDragOffset({
          x: pos.x - bounds.x,
          y: pos.y - bounds.y
        });
        setIsDrawing(true);
      } else {
        setSelectedElement(null);
      }
    } else if (currentTool === 'text') {
      setTextPosition(pos);
      setShowTextInput(true);
    } else {
      setIsDrawing(true);
      setSelectedElement(null);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isDrawing || readOnly) return;

    const pos = getMousePos(e);

    if (currentTool === 'select' && selectedElement) {
      // Move selected element
      setElements(prev => prev.map(el => {
        if (el.id === selectedElement) {
          const newX = pos.x - dragOffset.x;
          const newY = pos.y - dragOffset.y;
          
          switch (el.type) {
            case 'rectangle':
            case 'circle':
            case 'text':
              return { ...el, x: newX, y: newY };
            case 'arrow':
            case 'line':
              const deltaX = newX - el.startX!;
              const deltaY = newY - el.startY!;
              return {
                ...el,
                startX: newX,
                startY: newY,
                endX: el.endX! + deltaX,
                endY: el.endY! + deltaY
              };
            default:
              return el;
          }
        }
        return el;
      }));
    }
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isDrawing || readOnly) return;

    const pos = getMousePos(e);

    if (currentTool !== 'select' && currentTool !== 'text') {
      const newElement: DrawingElement = {
        id: Date.now().toString(),
        type: currentTool,
        x: Math.min(startPos.x, pos.x),
        y: Math.min(startPos.y, pos.y),
        color: '#374151',
        strokeWidth: 2
      };

      switch (currentTool) {
        case 'rectangle':
          newElement.width = Math.abs(pos.x - startPos.x);
          newElement.height = Math.abs(pos.y - startPos.y);
          break;
        case 'circle':
          const radius = Math.sqrt(
            Math.pow(pos.x - startPos.x, 2) + Math.pow(pos.y - startPos.y, 2)
          ) / 2;
          newElement.x = startPos.x;
          newElement.y = startPos.y;
          newElement.radius = radius;
          break;
        case 'arrow':
        case 'line':
          newElement.startX = startPos.x;
          newElement.startY = startPos.y;
          newElement.endX = pos.x;
          newElement.endY = pos.y;
          break;
      }

      const newElements = [...elements, newElement];
      setElements(newElements);
      addToHistory(newElements);
      triggerSave(newElements);
    } else if (currentTool === 'select' && selectedElement) {
      addToHistory(elements);
      triggerSave(elements);
    }

    setIsDrawing(false);
  };

  const handleTextSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (textInput.trim()) {
      const newElement: DrawingElement = {
        id: Date.now().toString(),
        type: 'text',
        x: textPosition.x,
        y: textPosition.y,
        text: textInput,
        color: '#374151',
        strokeWidth: 1
      };

      const newElements = [...elements, newElement];
      setElements(newElements);
      addToHistory(newElements);
      triggerSave(newElements);
    }

    setTextInput('');
    setShowTextInput(false);
  };

  const deleteSelected = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    if (selectedElement) {
      const newElements = elements.filter(el => el.id !== selectedElement);
      setElements(newElements);
      addToHistory(newElements);
      setSelectedElement(null);
      triggerSave(newElements);
    }
  };

  const clearCanvas = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    const newElements: DrawingElement[] = [];
    setElements(newElements);
    addToHistory(newElements);
    setSelectedElement(null);
    triggerSave(newElements);
  };

  const saveCanvas = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    triggerSave(elements);
  };

  const exportAsImage = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    
    const canvas = canvasRef.current!;
    const link = document.createElement('a');
    link.download = 'system-design.png';
    link.href = canvas.toDataURL();
    link.click();
  };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    // Clear canvas
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);

    // Draw grid
    ctx.strokeStyle = '#E5E7EB';
    ctx.lineWidth = 1;
    for (let i = 0; i <= canvasWidth; i += 20) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, canvasHeight);
      ctx.stroke();
    }
    for (let i = 0; i <= canvasHeight; i += 20) {
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(canvasWidth, i);
      ctx.stroke();
    }

    // Draw elements
    elements.forEach(element => drawElement(ctx, element));
  }, [elements, selectedElement]);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      {!readOnly && (
        <div className="flex flex-wrap items-center gap-2 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant={currentTool === 'select' ? 'primary' : 'outline'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentTool('select');
              }}
              leftIcon={<Move size={16} />}
            >
              Select
            </Button>
            <Button
              type="button"
              size="sm"
              variant={currentTool === 'rectangle' ? 'primary' : 'outline'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentTool('rectangle');
              }}
              leftIcon={<Square size={16} />}
            >
              Rectangle
            </Button>
            <Button
              type="button"
              size="sm"
              variant={currentTool === 'circle' ? 'primary' : 'outline'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentTool('circle');
              }}
              leftIcon={<Circle size={16} />}
            >
              Circle
            </Button>
            <Button
              type="button"
              size="sm"
              variant={currentTool === 'arrow' ? 'primary' : 'outline'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentTool('arrow');
              }}
              leftIcon={<ArrowRight size={16} />}
            >
              Arrow
            </Button>
            <Button
              type="button"
              size="sm"
              variant={currentTool === 'line' ? 'primary' : 'outline'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentTool('line');
              }}
              leftIcon={<Minus size={16} />}
            >
              Line
            </Button>
            <Button
              type="button"
              size="sm"
              variant={currentTool === 'text' ? 'primary' : 'outline'}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setCurrentTool('text');
              }}
              leftIcon={<Type size={16} />}
            >
              Text
            </Button>
          </div>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={undo}
              disabled={historyIndex <= 0}
              leftIcon={<Undo size={16} />}
            >
              Undo
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              leftIcon={<Redo size={16} />}
            >
              Redo
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={deleteSelected}
              disabled={!selectedElement}
              leftIcon={<Trash2 size={16} />}
            >
              Delete
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={clearCanvas}
              leftIcon={<Trash2 size={16} />}
            >
              Clear All
            </Button>
          </div>

          <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={exportAsImage}
              leftIcon={<Download size={16} />}
            >
              Export PNG
            </Button>
            {onSave && (
              <Button
                type="button"
                size="sm"
                onClick={saveCanvas}
                leftIcon={<Upload size={16} />}
              >
                Save Design
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Canvas */}
      <div className="border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden bg-white">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="block cursor-crosshair"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>

      {/* Text Input Modal */}
      {showTextInput && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Add Text
            </h3>
            <form onSubmit={handleTextSubmit}>
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleTextSubmit();
                  }
                  if (e.key === 'Escape') {
                    e.preventDefault();
                    setShowTextInput(false);
                  }
                }}
              />
              <div className="flex justify-end gap-2 mt-4">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowTextInput(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                >
                  Add Text
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Instructions */}
      {!readOnly && (
        <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <p className="font-medium mb-1">Drawing Instructions:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Select a tool from the toolbar above</li>
            <li>Click and drag to create shapes and lines</li>
            <li>Use the Select tool to move elements around</li>
            <li>Click Text tool then click on canvas to add labels</li>
            <li>Use Undo/Redo to manage your changes</li>
            <li>Export your design as PNG or save it with your submission</li>
          </ul>
        </div>
      )}
    </div>
  );
};