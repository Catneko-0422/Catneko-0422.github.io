"use client";

import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 300, height: 200 });
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState<{
    direction: string;
    startX: number;
    startY: number;
  } | null>(null);
  const [time, setTime] = useState("");
  const offset = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e:React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  };

  const handleMouseMove = (e:React.MouseEvent<HTMLDivElement>) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      });
    } else if (resizing) {
      const { direction, startX, startY } = resizing;
      const deltaX = e.clientX - startX;
      const deltaY = e.clientY - startY;

      setSize((prev) => {
        let newWidth = prev.width;
        let newHeight = prev.height;
        let newX = position.x;
        let newY = position.y;

        if (direction.includes("right")) newWidth = Math.max(200, prev.width + deltaX);
        if (direction.includes("bottom")) newHeight = Math.max(150, prev.height + deltaY);
        if (direction.includes("left")) {
          newWidth = Math.max(200, prev.width - deltaX);
          newX = position.x + deltaX;
        }
        if (direction.includes("top")) {
          newHeight = Math.max(150, prev.height - deltaY);
          newY = position.y + deltaY;
        }

        setPosition({ x: newX, y: newY });
        return { width: newWidth, height: newHeight };
      });

      setResizing((prev) => prev && { ...prev, startX: e.clientX, startY: e.clientY });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
    setResizing(null);
  };

  const handleResizeMouseDown = (e:React.MouseEvent<HTMLDivElement>, direction:string) => {
    e.stopPropagation();
    setResizing({ direction, startX: e.clientX, startY: e.clientY });
  }

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("zh-TW", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: "Asia/Taipei",
      });
      setTime(formattedTime);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="h-screen w-screen flex items-center justify-center bg-black/90"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div
        className="bg-white shadow-lg rounded-lg absolute"
        style={{
          left: position.x,
          top: position.y,
          width: size.width,
          height: size.height,
        }}
      >

        {/* 拖動點（四個邊 & 四個角） */}
        <div className="absolute inset-0">
          {/* 左上角 */}
          <div className="absolute top-0 left-0 w-4 h-4 cursor-nwse-resize" onMouseDown={(e) => handleResizeMouseDown(e, "top left")}></div>
          {/* 上邊 */}
          <div className="absolute top-0 left-0 w-full h-2 cursor-ns-resize" onMouseDown={(e) => handleResizeMouseDown(e, "top")}></div>
          {/* 右上角 */}
          <div className="absolute top-0 right-0 w-4 h-4 cursor-nesw-resize" onMouseDown={(e) => handleResizeMouseDown(e, "top right")}></div>
          <div
            className="w-full bg-gray-800 text-white font-bold px-4 py-2 cursor-move rounded-t-lg"
            onMouseDown={handleMouseDown}
          >
            可拖動視窗
          </div>

          {/* 左邊 */}
          <div className="absolute left-0 top-0 h-full w-2 cursor-ew-resize" onMouseDown={(e) => handleResizeMouseDown(e, "left")}></div>
          {/* 內容區 */}
          <div className="p-4 text-gray-900 h-full">
            <p>拖動視窗標題來移動！</p>
            <p>拖動四邊或四角來調整大小！</p>
          </div>
          {/* 視窗標題（可拖動） */}
          {/* 右邊 */}
          <div className="absolute right-0 top-0 h-full w-2 cursor-ew-resize" onMouseDown={(e) => handleResizeMouseDown(e, "right")}></div> 

          {/* 左下角 */}
          <div className="absolute bottom-0 left-0 w-4 h-4 cursor-nesw-resize" onMouseDown={(e) => handleResizeMouseDown(e, "bottom left")}></div>
          {/* 下邊 */}
          <div className="absolute bottom-0 left-0 w-full h-2 cursor-ns-resize" onMouseDown={(e) => handleResizeMouseDown(e, "bottom")}></div>
          {/* 右下角 */}
          <div className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize" onMouseDown={(e) => handleResizeMouseDown(e, "bottom right")}></div>
        </div>
      </div>

      {/* Dock欄 */}
      <footer className="fixed bottom-0 left-0 w-full h-12 border-t-2 border-blue-700 bg-gray-900 flex items-center p-2 shadow-lg">
        <div className="windows-list w-10 h-10 bg-gray-700 rounded-lg"></div>
        <div className="Language w-10 h-10 bg-gray-700 rounded-lg"></div>

        {/* 時間顯示（固定在最右邊） */}
        <div className="now-time w-24 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-white font-mono ml-auto">
          {time}
        </div>
      </footer>
    </div>
  );
}
