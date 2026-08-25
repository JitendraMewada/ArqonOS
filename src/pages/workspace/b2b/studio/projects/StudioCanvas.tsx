import React, { useState, useRef, useEffect } from 'react';
import { 
  Stage, Layer, Rect, Circle, Line, Text, Transformer 
} from 'react-konva';
import { 
  MousePointer2, Square, Circle as CircleIcon, 
  Minus, Type, Pencil, Eraser, Move,
  Download, Save, ZoomIn, ZoomOut, RefreshCcw,
  Trash2, Maximize, Minimize
} from 'lucide-react';
import { useStudio } from '../StudioContext';
import { cn } from '../../../../../lib/utils';

interface CanvasElement {
  id: string;
  type: 'rect' | 'circle' | 'line' | 'text' | 'pencil';
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  rotation?: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  text?: string;
  points?: number[];
}

interface StudioCanvasProps {
  sketchId: string;
  projectId: string;
  initialData: string;
}

export function StudioCanvas({ sketchId, projectId, initialData }: StudioCanvasProps) {
  const { updateProjectSketch } = useStudio();
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tool, setTool] = useState<'select' | 'rect' | 'circle' | 'line' | 'text' | 'pencil' | 'eraser' | 'pan'>('pencil');
  const [color, setColor] = useState('#f97316'); // orange-500
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isSaving, setIsSaving] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<any>(null);
  const transformerRef = useRef<any>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    console.log('Rendering StudioCanvas', dimensions);
  }, [dimensions]);

  // Responsive sizing
  useEffect(() => {
    if (!containerRef.current) return;
    
    const updateSize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateSize(); // Initial call
    
    const observer = new ResizeObserver(updateSize);
    observer.observe(containerRef.current);
    
    window.addEventListener('resize', updateSize);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Initialize data
  useEffect(() => {
    try {
      const data = JSON.parse(initialData);
      if (data.elements) setElements(data.elements);
      if (data.zoom) setScale(data.zoom);
      if (data.pan) setPosition(data.pan);
    } catch (err) {
      console.error("Failed to parse initial canvas data", err);
    }
  }, [initialData]);

  // Handle autosave
  useEffect(() => {
    const timer = setTimeout(() => {
      saveCanvas();
    }, 5000);
    return () => clearTimeout(timer);
  }, [elements]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await containerRef.current?.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error('Error attempting to enable fullscreen:', err);
    }
  };

  const saveCanvas = async () => {
    if (isSaving) return;
    try {
      setIsSaving(true);
      await updateProjectSketch(projectId, sketchId, {
        canvasData: JSON.stringify({ elements, zoom: scale, pan: position })
      });
    } catch (err) {
      console.error("Failed to save canvas:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleMouseDown = (e: any) => {
    if (tool === 'pan') return;
    
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }

    if (tool === 'select') return;

    isDrawing.current = true;
    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;
    const pos = {
      x: (pointerPosition.x - stage.x()) / stage.scaleX(),
      y: (pointerPosition.y - stage.y()) / stage.scaleY()
    };
    const id = `el-${Date.now()}`;

    if (tool === 'rect') {
      setElements([...elements, { id, type: 'rect', x: pos.x, y: pos.y, width: 0, height: 0, fill: 'transparent', stroke: color, strokeWidth }]);
    } else if (tool === 'circle') {
      setElements([...elements, { id, type: 'circle', x: pos.x, y: pos.y, radius: 0, fill: 'transparent', stroke: color, strokeWidth }]);
    } else if (tool === 'pencil' || tool === 'line') {
      setElements([...elements, { id, type: tool, x: 0, y: 0, points: [pos.x, pos.y], stroke: color, strokeWidth }]);
    } else if (tool === 'text') {
      const txt = prompt('Enter text:');
      if (txt) {
        setElements([...elements, { id, type: 'text', x: pos.x, y: pos.y, text: txt, fill: color }]);
      }
      isDrawing.current = false;
    }
    
    setSelectedId(id);
  };

  const handleMouseMove = (e: any) => {
    if (!isDrawing.current || tool === 'select' || tool === 'pan') return;

    const stage = e.target.getStage();
    const pointerPosition = stage.getPointerPosition();
    if (!pointerPosition) return;
    const pos = {
      x: (pointerPosition.x - stage.x()) / stage.scaleX(),
      y: (pointerPosition.y - stage.y()) / stage.scaleY()
    };
    const lastElement = elements[elements.length - 1];
    
    if (!lastElement) return;

    const newElements = elements.slice(0, elements.length - 1);

    if (tool === 'rect') {
      newElements.push({ ...lastElement, width: pos.x - lastElement.x, height: pos.y - lastElement.y });
    } else if (tool === 'circle') {
      const dx = pos.x - lastElement.x;
      const dy = pos.y - lastElement.y;
      newElements.push({ ...lastElement, radius: Math.sqrt(dx*dx + dy*dy) });
    } else if (tool === 'pencil') {
      newElements.push({ ...lastElement, points: lastElement.points?.concat([pos.x, pos.y]) });
    } else if (tool === 'line') {
      newElements.push({ ...lastElement, points: [lastElement.points![0], lastElement.points![1], pos.x, pos.y] });
    }

    setElements(newElements);
  };

  useEffect(() => {
    if (selectedId && transformerRef.current) {
      const selectedNode = stageRef.current.findOne('#' + selectedId);
      if (selectedNode) {
        transformerRef.current.nodes([selectedNode]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId, tool]);

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleTransformEnd = (e: any) => {
    const node = e.target;
    const id = node.id();
    setElements(elements.map(el => {
      if (el.id === id) {
        return {
          ...el,
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          width: node.width() * node.scaleX(),
          height: node.height() * node.scaleY(),
          scaleX: 1,
          scaleY: 1
        };
      }
      return el;
    }));
  };

  const deleteSelected = () => {
    if (selectedId) {
      setElements(elements.filter(el => el.id !== selectedId));
      setSelectedId(null);
    }
  };

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const stage = e.target.getStage();
    const oldScale = stage.scaleX();
    const mousePointTo = {
      x: (stage.getPointerPosition().x - stage.x()) / oldScale,
      y: (stage.getPointerPosition().y - stage.y()) / oldScale,
    };

    const newScale = e.evt.deltaY > 0 ? oldScale / 1.1 : oldScale * 1.1;
    setScale(newScale);
    setPosition({
      x: stage.getPointerPosition().x - mousePointTo.x * newScale,
      y: stage.getPointerPosition().y - mousePointTo.y * newScale,
    });
  };

  const tools = [
    { id: 'select', icon: MousePointer2, label: 'Select' },
    { id: 'pan', icon: Move, label: 'Pan' },
    { id: 'pencil', icon: Pencil, label: 'Sketch' },
    { id: 'rect', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: CircleIcon, label: 'Circle' },
    { id: 'line', icon: Minus, label: 'Line' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
  ];

  const colors = ['#f97316', '#3b82f6', '#10b981', '#ef4444', '#8b5cf6', '#000000', '#64748b'];

  return (
    <div ref={containerRef} className="flex w-full h-full relative overflow-hidden bg-slate-100 dark:bg-slate-950" style={{ touchAction: 'none', overscrollBehavior: 'none' }}>
      {/* Toolbar */}
      <div className="absolute left-4 top-4 z-10 flex flex-col gap-1 p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-xl shadow-2xl shadow-slate-900/10">
        {tools.map(t => (
          <button
            key={t.id}
            onClick={() => setTool(t.id as any)}
            className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center transition-all group relative",
              tool === t.id 
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20" 
                : "text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            )}
          >
            <t.icon className="w-4 h-4" />
            <span className="absolute left-full ml-3 px-2 py-1 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-all whitespace-nowrap z-50">
              {t.label}
            </span>
          </button>
        ))}
        
        <div className="h-px bg-slate-200 dark:bg-slate-800 my-1" />
        
        <button 
          onClick={deleteSelected}
          disabled={!selectedId}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Style Controls */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-3 p-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-xl shadow-xl shadow-slate-900/10">
        <div className="flex gap-1">
          {colors.map(c => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn(
                "w-5 h-5 rounded-full border-2 transition-all",
                color === c ? "border-slate-900 dark:border-white scale-110" : "border-transparent"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
        <div className="h-4 w-px bg-slate-200 dark:bg-slate-800" />
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-black uppercase text-slate-400 hidden sm:inline">Width</span>
          <input 
            type="range" min="1" max="20" 
            value={strokeWidth} 
            onChange={(e) => setStrokeWidth(parseInt(e.target.value))}
            className="w-16 sm:w-20 accent-orange-500"
          />
        </div>
      </div>

      {/* Zoom Controls */}
      <div className="absolute right-4 bottom-4 z-10 flex flex-col gap-1 p-1.5 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-white/20 dark:border-slate-800/50 rounded-xl shadow-xl shadow-slate-900/10">
        <button onClick={toggleFullscreen} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 transition-all">
          {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
        </button>
        <button onClick={() => setScale(s => s * 1.2)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 transition-all"><ZoomIn className="w-4 h-4" /></button>
        <button onClick={() => setScale(s => s / 1.2)} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 transition-all"><ZoomOut className="w-4 h-4" /></button>
        <button onClick={() => { setScale(1); setPosition({ x: 0, y: 0 }); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 transition-all"><RefreshCcw className="w-4 h-4" /></button>
      </div>

      {/* Action Buttons */}
      <div className="absolute left-4 bottom-4 z-10 flex gap-2">
        <button 
          onClick={saveCanvas}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl flex items-center gap-2 font-black text-[10px] uppercase tracking-widest text-slate-900 dark:text-white shadow-lg hover:shadow-xl transition-all active:scale-95"
        >
          <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Canvas Stage */}
      <div className="w-full h-full flex-1 cursor-crosshair bg-slate-50 dark:bg-slate-900/20 rounded-xl overflow-hidden pointer-events-auto">
        <Stage
          width={dimensions.width}
          height={dimensions.height}
          scaleX={scale}
          scaleY={scale}
          x={position.x}
          y={position.y}
          draggable={tool === 'pan'}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
          onContextMenu={(e) => e.evt.preventDefault()}
          onDragMove={(e) => {
            if (e.target === e.target.getStage()) {
              setPosition({ x: e.target.x(), y: e.target.y() });
            }
          }}
          onDragEnd={(e) => {
            if (e.target === e.target.getStage()) {
              setPosition({ x: e.target.x(), y: e.target.y() });
            }
          }}
          onWheel={handleWheel}
          ref={stageRef}
        >
          <Layer>
            {/* Grid Pattern */}
            {Array.from({ length: Math.ceil(dimensions.width / 50) + 1 }).map((_, i) => (
              <Line
                key={`v-${i}`}
                points={[i * 50, -position.y / scale, i * 50, (dimensions.height - position.y) / scale]}
                stroke="#e2e8f0"
                strokeWidth={0.5}
                listening={false}
              />
            ))}
            {Array.from({ length: Math.ceil(dimensions.height / 50) + 1 }).map((_, i) => (
              <Line
                key={`h-${i}`}
                points={[-position.x / scale, i * 50, (dimensions.width - position.x) / scale, i * 50]}
                stroke="#e2e8f0"
                strokeWidth={0.5}
                listening={false}
              />
            ))}

            {elements.map((el) => {
              if (el.type === 'rect') {
                return (
                  <Rect
                    key={el.id}
                    id={el.id}
                    {...el}
                    draggable={tool === 'select'}
                    onClick={() => setSelectedId(el.id)}
                    onDragEnd={handleTransformEnd}
                    onTransformEnd={handleTransformEnd}
                  />
                );
              }
              if (el.type === 'circle') {
                return (
                  <Circle
                    key={el.id}
                    id={el.id}
                    {...el}
                    draggable={tool === 'select'}
                    onClick={() => setSelectedId(el.id)}
                    onDragEnd={handleTransformEnd}
                    onTransformEnd={handleTransformEnd}
                  />
                );
              }
              if (el.type === 'line' || el.type === 'pencil') {
                return (
                  <Line
                    key={el.id}
                    id={el.id}
                    {...el}
                    tension={0.5}
                    lineCap="round"
                    lineJoin="round"
                    draggable={tool === 'select'}
                    onClick={() => setSelectedId(el.id)}
                    onDragEnd={handleTransformEnd}
                  />
                );
              }
              if (el.type === 'text') {
                return (
                  <Text
                    key={el.id}
                    id={el.id}
                    {...el}
                    fontSize={20}
                    fontFamily="Inter"
                    fontStyle="bold"
                    draggable={tool === 'select'}
                    onClick={() => setSelectedId(el.id)}
                    onDragEnd={handleTransformEnd}
                  />
                );
              }
              return null;
            })}
            
            {selectedId && tool === 'select' && (
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  if (newBox.width < 5 || newBox.height < 5) return oldBox;
                  return newBox;
                }}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
