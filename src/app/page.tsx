'use client';

import React, { useState, useEffect } from "react";
import Window from "../component/windows";

export default function Home() {
  const [windows, setWindows] = useState<{
    id: number;
    title: string;
    minimized: boolean;
    maximized: boolean;
  }>({
    id: 1,
    title: "About",
    minimized: false,
    maximized: false,
  });

  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [size, setSize] = useState({ width: 300, height: 200 });
  const [language, setLanguage] = useState("中文");
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formattedDateTime = now.toLocaleString("zh-TW", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
      setTime(formattedDateTime);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleMinimize = () => {
    setWindows((prev) => ({ ...prev, minimized: true }));
  };

  const handleRestore = () => {
    setWindows((prev) => ({ ...prev, minimized: false }));
  };

  const handleMaximize = () => {
    setWindows((prev) => ({
      ...prev,
      maximized: !prev.maximized,
    }));
  
    if (!windows.maximized) {
      setPosition({ x: 30, y: 25 });
      setSize({ width: window.innerWidth, height: window.innerHeight });
    } else {
      setSize({ width: 300, height: 200 });
      setPosition({ x: 100, y: 100 });
    }
  };

  return (
    <div>
      <div className="h-screen w-screen flex items-center justify-center bg-black/90">
        <Window
          title={windows.title}
          position={position}
          size={size}
          minimized={windows.minimized}
          maximized={windows.maximized}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
          onDrag={(x, y) => setPosition({ x, y })}
          onResize={(width, height) => setSize({ width, height })}
        >
          <p>關於我</p>
        </Window>
      </div>

      <footer className="fixed bottom-0 left-0 w-full h-12 border-t-2 border-blue-700 bg-gray-900 flex items-center p-2 shadow-lg">
        <div className="windows-list w-25 h-10 bg-gray-700 rounded-lg flex items-center justify-center">
          {windows.minimized && (
            <button
              className="text-white font-bold"
              onClick={handleRestore}
            >
              {windows.title}
            </button>
          )}
        </div>
        <div className="flex items-center ml-auto gap-2">
          <div className="Language w-28 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-white font-mono">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-white outline-none cursor-pointer"
            >
              <option className="text-black" value="中文">中文</option>
              <option className="text-black" value="English">English</option>
              <option className="text-black" value="日本語">日本語</option>
            </select>
          </div>
          <div className="now-time w-50 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-white font-mono">
            {time}
          </div>
        </div>
      </footer>
    </div>
  );
}
