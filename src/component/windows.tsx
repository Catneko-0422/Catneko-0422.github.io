import React, { useState, useRef } from "react";

type WindowProps = {
  title: string;
  children: React.ReactNode;
  position: { x: number; y: number };
  size: { width: number; height: number };
  minimized: boolean;
  maximized: boolean;
  zIndex: number;
  onMinimize: () => void;
  onMaximize: () => void;
  onDrag: (x: number, y: number) => void;
  onResize: (width: number, height: number) => void;
};

const Window = ({
  title,
  children,
  position,
  size,
  zIndex,
  minimized,
  maximized,
  onMinimize,
  onMaximize,
  onDrag,
  onResize,
}: WindowProps) => {
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const [resizing, setResizing] = useState<{
    direction: string;
    startX: number;
    startY: number;
  } | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (dragging) {
      requestAnimationFrame(() => {
        let newX = e.clientX - offset.current.x;
        let newY = e.clientY - offset.current.y + 30;

        // 限制視窗不超過最大寬度與高度
        newX = Math.max(0, Math.min(newX, window.innerWidth - size.width)); // 限制 X 軸範圍
        newY = Math.max(0, Math.min(newY, window.innerHeight - size.height)) - 40; // 限制 Y 軸範圍

        // 呼叫 onDrag 更新位置
        onDrag(newX, newY);
      });
    }
};

  const handleMouseUp = () => {
    setDragging(false);
  };

  const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>, direction: string) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const handleResizeMove = (moveEvent: MouseEvent) => {
        requestAnimationFrame(() => {
          const deltaX = moveEvent.clientX - startX;
          const deltaY = moveEvent.clientY - startY;
    
          let newWidth = size.width;
          let newHeight = size.height;
          let newX = position.x;
          let newY = position.y;
    
          // 根據方向來改變大小
          switch (direction) {
            case "top left":
              newWidth = size.width - deltaX;
              newHeight = size.height - deltaY;
              newX = position.x + deltaX;
              newY = position.y + deltaY;
              break;
            case "top":
              newHeight = size.height - deltaY;
              newY = position.y + deltaY;
              break;
            case "top right":
              newWidth = size.width + deltaX;
              newHeight = size.height - deltaY;
              newY = position.y + deltaY;
              break;
            case "right":
              newWidth = size.width + deltaX;
              break;
            case "bottom right":
              newWidth = size.width + deltaX;
              newHeight = size.height + deltaY;
              break;
            case "bottom":
              newHeight = size.height + deltaY;
              break;
            case "bottom left":
              newWidth = size.width - deltaX;
              newHeight = size.height + deltaY;
              newX = position.x + deltaX;
              break;
            case "left":
              newWidth = size.width - deltaX;
              newX = position.x + deltaX;
              break;
            default:
              break;
          }
    
          // 更新大小和位置
          onResize(newWidth, newHeight);
          onDrag(newX, newY);
        });
    };
  
    const handleResizeEnd = () => {
      document.removeEventListener("mousemove", handleResizeMove);
      document.removeEventListener("mouseup", handleResizeEnd);
    };
  
    document.addEventListener("mousemove", handleResizeMove);
    document.addEventListener("mouseup", handleResizeEnd);
  };
  

  if (minimized) return null;

  return (
    <div
      className="bg-white shadow-lg rounded-lg absolute"
      style={{
        left: position.x,
        top: position.y,
        width: maximized ? "95%" : size.width,
        height: maximized ? "80%" : size.height,
        zIndex: zIndex,
      }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
    <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-5 h-5 cursor-nwse-resize" onMouseDown={(e) => handleResizeMouseDown(e, "top left")}></div>
        <div className="absolute top-0 left-0 w-full h-2 cursor-ns-resize" onMouseDown={(e) => handleResizeMouseDown(e, "top")}></div>
        <div className="absolute top-0 right-0 w-5 h-5 cursor-nesw-resize" onMouseDown={(e) => handleResizeMouseDown(e, "top right")}></div>
        <div
        className="w-full bg-gray-800 text-white font-bold px-4 py-2 cursor-move rounded-t-lg flex justify-between items-center"
        onMouseDown={handleMouseDown}
        >
            <div className="title">{title}</div>
            <div className="window-controls flex gap-2">
                <div
                className="window-minimize w-6 h-6 bg-gray-700 rounded-full cursor-pointer flex items-center justify-center"
                onClick={onMinimize}
                >
                ―
                </div>
                <div
                className="window-maximize w-6 h-6 bg-gray-700 rounded-full cursor-pointer flex items-center justify-center"
                onClick={onMaximize}
                >
                {maximized ? "❐" : "☐"}
                </div>
            </div>
        </div>
        <div className="absolute left-0 top-0 h-full w-2 cursor-ew-resize" onMouseDown={(e) => handleResizeMouseDown(e, "left")}></div>
        
        <div
          className="p-4 text-gray-900 overflow-y-auto transition-all duration-300 ease-in-out"
          style={{
            maxHeight: `${size.height * 0.85}px`, // 修正邏輯錯誤，原本寫成 vh 太小了喵
          }}
        >
          {children}
        </div>

        <div className="absolute right-0 top-0 h-full w-2 cursor-ew-resize" onMouseDown={(e) => handleResizeMouseDown(e, "right")}></div>
    </div>
    <div className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize" onMouseDown={(e) => handleResizeMouseDown(e, "bottom left")}></div>
        <div className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize" onMouseDown={(e) => handleResizeMouseDown(e, "bottom")}></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize" onMouseDown={(e) => handleResizeMouseDown(e, "bottom right")}></div>
    </div>
  );
};

export default Window;
