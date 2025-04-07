'use client';

import React, { useState, useEffect } from "react";
import Window from "../component/windows";
import About from '../component/About';
import Project from "../component/Project"
import Contact from "../component/Contact"
import MobileLayout from "../component/MobileLayout"
import Chat from "../component/Chat"

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [windows, setWindows] = useState([
    {
      id: 1,
      title: "About",
      minimized: false,
      maximized: false,
      position: { x: 10, y: 10 },
      size: { width: 400, height: 460 },
      originalPosition: { x: 10, y: 10 },
      originalSize: { width: 400, height: 460 },
      content: <About />,
      zIndex: 4,
    },
    {
      id: 2,
      title: "Project",
      minimized: false,
      maximized: false,
      position: { x: 420, y: 10 },
      size: { width: 400, height: 460 },
      originalPosition: { x: 420, y: 10 },
      originalSize: { width: 400, height: 460 },
      content: <Project />,
      zIndex: 3,
    },
    {
      id: 3,
      title: "Contact",
      minimized: false,
      maximized: false,
      position: { x: 830, y: 10 },
      size: { width: 400, height: 460 },
      originalPosition: { x: 830, y: 10 },
      originalSize: { width: 400, height: 460 },
      content: <Contact />,
      zIndex: 2,
    },
    {
      id: 4,
      title: "Chat",
      minimized: false,
      maximized: false,
      position: { x: 10, y: 480 },
      size: { width: 400, height: 400 },
      content: <Chat />,
      zIndex: 1,
    },
  ]);

  const [language, setLanguage] = useState("中文");
  const [time, setTime] = useState("");

  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.matchMedia('(max-width: 1024px)').matches;
      setIsMobile(isMobileDevice);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

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

  const updateWindow = (id: number, newData: Partial<typeof windows[0]>) => {
    setWindows((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          if ('maximized' in newData) {
            if (newData.maximized) {
              return {
                ...w,
                ...newData,
                originalPosition: w.position,
                originalSize: w.size,
                position: { x: 30, y: 25 },
                size: { width: window.innerWidth - 60, height: window.innerHeight - 100 },
                zIndex: Math.max(...prev.map((w) => w.zIndex)) + 1
              } as typeof windows[0];
            } else {
              return {
                ...w,
                ...newData,
                position: w.originalPosition || w.position,
                size: w.originalSize || w.size,
                zIndex: Math.max(...prev.map((w) => w.zIndex)) + 1
              } as typeof windows[0];
            }
          }
          return {
            ...w,
            ...newData,
            position: newData.position || w.position,
            size: newData.size || w.size,
            zIndex: Math.max(...prev.map((w) => w.zIndex)) + 1
          } as typeof windows[0];
        }
        return w;
      })
    );
  };

  if (isMobile) {
    return <MobileLayout />;
  }

  return (
    <div>
      <div className="h-screen w-screen flex items-center justify-center bg-black/90">
        {windows.map((win) =>
          !win.minimized ? (
            <Window
              key={win.id}
              title={win.title}
              position={win.position}
              size={win.size}
              minimized={win.minimized}
              maximized={win.maximized}
              zIndex={win.zIndex}
              onMinimize={() => updateWindow(win.id, { minimized: true })}
              onMaximize={() =>
                updateWindow(win.id, {
                  maximized: !win.maximized,
                  position: !win.maximized ? { x: 30, y: 25 } : { x: 100, y: 100 },
                  size: !win.maximized
                    ? { width: window.innerWidth - 60, height: window.innerHeight - 100 }
                    : { width: 300, height: 200 },
                })
              }
              onDrag={(x, y) => updateWindow(win.id, { position: { x, y } })}
              onResize={(width, height) =>
                updateWindow(win.id, { size: { width, height } })
              }
            >
              {win.content}
            </Window>
          ) : null
        )}
      </div>

      <footer className="fixed bottom-0 left-0 w-full h-12 border-t-2 border-blue-700 bg-gray-900 flex items-center p-2 shadow-lg">
        <div className="windows-list w-60 h-10 bg-gray-700 flex items-center justify-start gap-2 px-2">
          {windows
            .filter((w) => w.minimized)
            .map((w) => (
              <button
                key={w.id}
                className="text-white font-bold"
                onClick={() => updateWindow(w.id, { minimized: false })}
              >
                {w.title}
              </button>
            ))}
        </div>
        <div className="flex items-center ml-auto gap-2">
          <div className="Language w-28 h-10 bg-gray-700 flex items-center justify-center text-white font-mono">
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
          <div className="now-time w-50 h-10 bg-gray-700 flex items-center justify-center text-white font-mono">
            {time}
          </div>
        </div>
      </footer>
    </div>
  );
}
