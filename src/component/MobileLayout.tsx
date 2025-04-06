import React, { useState } from 'react';
import About from './About';
import Project from './Project';
import Contact from './Contact';

const MobileLayout = () => {
  const [activeTab, setActiveTab] = useState('about');

  const renderContent = () => {
    switch (activeTab) {
      case 'about':
        return <About />;
      case 'project':
        return <Project />;
      case 'contact':
        return <Contact />;
      default:
        return <About />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black/90">
      {/* 頂部導航欄 */}
      <div className="w-full bg-gray-800 text-white p-4">
        <h1 className="text-xl font-bold text-center text-white">Catneko</h1>
      </div>

      {/* 主要內容區域 */}
      <div className="flex-1 overflow-y-auto p-4 text-white">
        {renderContent()}
      </div>

      {/* 底部導航欄 */}
      <div className="w-full bg-gray-800 text-white">
        <div className="flex justify-around p-2">
          <button
            className={`flex flex-col items-center p-2 ${activeTab === 'about' ? 'text-blue-400' : 'text-white'}`}
            onClick={() => setActiveTab('about')}
          >
            <span className="text-2xl">👤</span>
            <span className="text-xs text-white">About</span>
          </button>
          <button
            className={`flex flex-col items-center p-2 ${activeTab === 'project' ? 'text-blue-400' : 'text-white'}`}
            onClick={() => setActiveTab('project')}
          >
            <span className="text-2xl">📁</span>
            <span className="text-xs text-white">Project</span>
          </button>
          <button
            className={`flex flex-col items-center p-2 ${activeTab === 'contact' ? 'text-blue-400' : 'text-white'}`}
            onClick={() => setActiveTab('contact')}
          >
            <span className="text-2xl">📧</span>
            <span className="text-xs text-white">Contact</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileLayout; 